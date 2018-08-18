"use strict";

const {
    includes,
    isEmpty,
    compact,
    isArray,
    each,
    map,
    flattenDeep
} = require("lodash");

const {
    parseOAI,
    parseXML,
    createItemDataStructureFromGraphQL
} = require("./data-service-lib");
import gql from "graphql-tag";

module.exports = DataService;

DataService.$inject = [
    "$rootScope",
    "$log",
    "$http",
    "configuration",
    "eafParserService",
    "trsParserService",
    "ixtParserService",
    "flextextParserService",
    "lodash",
    "apollo",
    "$window"
];
function DataService(
    $rootScope,
    $log,
    $http,
    configuration,
    eaf,
    trs,
    ixt,
    ftp,
    lodash,
    apollo,
    $window
) {
    var ds = {
        getItem: getItem,
        libraryBoxLoader: libraryBoxLoader,
        loadTranscription: loadTranscription,
        broadcastMediaElementTime: broadcastMediaElementTime,
        listenForMediaElementBroadcast: listenForMediaElementBroadcast,
        broadcastPlayFrom: broadcastPlayFrom,
        listenForPlayFrom: listenForPlayFrom,
        data: {},
        loading: {}
    };
    return ds;

    function getItem(collectionId, itemId) {
        if (!ds.data[collectionId]) {
            ds.data[collectionId] = {};
            ds.data[collectionId][itemId] = {};
        }

        if (!ds.loading[collectionId]) {
            ds.loading[collectionId] = {};
        }

        if (ds.loading[collectionId][itemId]) {
            const data = ds.data[collectionId][itemId];
            return Promise.resolve(data);
        }

        if (
            !ds.loading[collectionId][itemId] &&
            !isEmpty(ds.data[collectionId][itemId])
        ) {
            const data = ds.data[collectionId][itemId];
            return Promise.resolve(Object.assign({}, data));
        }

        ds.loading[collectionId][itemId] = true;

        let url;
        if (configuration.datasource.mode === "online") {
            return onlineLoader(collectionId, itemId).then(processResponse);
        } else if (configuration.datasource.mode === "librarybox") {
            return libraryBoxLoader(collectionId, itemId).then(processResponse);
        } else {
            $log.error(`Unexpected mode set: ${configuration.datasource.mode}`);
            return {};
        }

        function processResponse(data) {
            // store the object in the service and let the metadata
            //  controller know it's ready to go
            data.collectionId = collectionId;
            data.itemId = itemId;
            data.collectionLink =
                configuration.datasource.collections + "/" + collectionId;

            ds.data[collectionId][itemId] = data;
            ds.loading[collectionId][itemId] = false;
            $rootScope.$broadcast("item data loaded");

            // and return it to the caller which is expecting a promise
            return Object.assign({}, data);
        }
    }

    function onlineLoader(collectionId, itemId) {
        return apollo
            .query({
                query: gql`
                    query($identifier: String!) {
                        items(full_identifier: $identifier, limit: 1, page: 1) {
                            results {
                                identifier: full_identifier
                                title
                                description
                                rights: access_condition_name
                                access_condition_details: access_narrative
                                permalink
                                access_class
                                date: originated_on
                                citation
                                collector {
                                    name
                                }
                                roles: item_agents {
                                    role_name
                                    user_name
                                }
                                collection {
                                    identifier
                                    permalink
                                }
                                files: essences {
                                    filename
                                    mimetype
                                }
                            }
                        }
                    }
                `,
                variables: {
                    identifier: `${collectionId}-${itemId}`
                }
            })
            .then(result => {
                return createItemDataStructureFromGraphQL(
                    result.data.items.results[0]
                );
            })
            .catch(error => {
                if (error.message.match(/401/)) {
                    $window.location.href = "http://catalog.paradisec.org.au";
                }
            });

        // NOTE: LEGACY OAI DATA LOADER
        // const itemIdentifier = configuration.datasource.itemIdentifier
        //   .replace('{{collectionId}}', collectionId)
        //   .replace('{{itemId}}', itemId);
        //
        // const url = configuration.datasource.getItem.replace(
        //   '{{itemId}}',
        //   itemIdentifier
        // );
        // $log.info(`ds getItem ${url}`);
        //
        // return $http
        //   .get(url, {transformResponse: parseOAI})
        //   .then(response => {
        //     return response.data.data;
        //   })
        //   .catch(() => $log.error("dataService: error, couldn't get", url));
    }

    function libraryBoxLoader(collectionId, itemId) {
        const url = "/repository/index.json";
        $log.info(`ds getItem ${url}`);
        return $http
            .get(url)
            .then(response => {
                if (collectionId && itemId) {
                    const result = response.data.filter(
                        d =>
                            d.collectionId === collectionId &&
                            d.itemId === itemId
                    );
                    return result[0].data;
                } else {
                    return response.data;
                }
            })
            .catch(() => $log.error("dataService: error, couldn't get", url));
    }

    function loadTranscription(type, item, as) {
        let transform;
        let what = {};
        if (type === "eaf") {
            transform = parseEAF;
        } else if (type === "trs") {
            transform = parseTRS;
        } else if (type === "ixt") {
            transform = parseIxt;
        } else if (type === "flextext") {
            transform = parseFlextext;
        } else {
            return;
        }

        return $http
            .get(item.url, {
                transformResponse: transform,
                withCredentials: true
            })
            .then(resp => {
                return resp.data.data;
            })
            .catch(err => {
                $log.error("ParadisecService: error, couldn't get", item[type]);
                console.log(err);
            });

        function parseEAF(d) {
            if (as === "xml") {
                return { data: parseXML(d, "xml") };
            } else {
                return { data: eaf.parse(parseXML(d)) };
            }
        }

        function parseTRS(d) {
            if (as === "xml") {
                return { data: parseXML(d, "xml") };
            } else {
                return { data: trs.parse(parseXML(d)) };
            }
        }

        function parseIxt(d) {
            if (as === "xml") {
                return { data: parseXML(d, "xml") };
            } else {
                return { data: ixt.parse(parseXML(d)) };
            }
        }

        function parseFlextext(d) {
            if (as === "xml") {
                return { data: parseXML(d, "xml") };
            } else {
                return { data: ftp.parse(parseXML(d)) };
            }
        }
    }

    function broadcastMediaElementTime(time) {
        ds.mediaElementTime = time;
        $rootScope.$broadcast("media time updated");
    }

    function listenForMediaElementBroadcast(callback) {
        return $rootScope.$on("media time updated", callback);
    }

    function broadcastPlayFrom(range) {
        ds.playFrom = range;
        $rootScope.$broadcast("media play from");
    }

    function listenForPlayFrom(callback) {
        return $rootScope.$on("media play from", callback);
    }
}
