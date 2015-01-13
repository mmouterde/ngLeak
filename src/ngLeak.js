javascript:(
function checkLeak(){
        var handleNode = function (node) {
            /*Look for expandos attributes (for jquery and jqlite)*/
            for (var attribute in node) {
                /*extract event handler map*/
                var eventHandlerMap = undefined;

                /*Jquery Pattern*/
                if (attribute.match(/^jQuery\d/) && node[attribute]) {
                    eventHandlerMap = $.cache[node[attribute]].events;
                }

                 /*Jqlite pattern*/
                if (attribute.match(/^ng\d/) && node[attribute]) {
                    eventHandlerMap = angular.element.cache[node[attribute]].events;
                }

                /*This attribute store eventHandlers, looking for duplicate*/
                if (eventHandlerMap) {
                    /*For each event type*/
                    for (var eventType in eventHandlerMap) {
                        var handlers = [];
                        var warnedHandlers = [];
                        /*Fetch event handler*/
                        for (var index = 0; index < eventHandlerMap[eventType].length; index++) {
                            /*Extract handler code*/
                            var handlerString;
                            if(angular.isFunction(eventHandlerMap[eventType][index])) {
                                //jqLite style
                                handlerString = eventHandlerMap[eventType][index].toString();
                            }
                            else {
                                //jquery style
                                handlerString = eventHandlerMap[eventType][index].handler.toString();
                            }
                            /*log if already exists for a given node, for a given event type*/
                            if (handlers.indexOf(handlerString) !== -1) {
                                if(warnedHandlers.indexOf(handlerString) === -1) {
                                    console.log('Memory leak with this event handler : \n' + handlerString);
                                    warnedHandlers.push(handlerString);
                                }
                            }
                            else {
                                /*If the first, add to handlers list*/
                                handlers.push(handlerString);
                            }
                        }
                        /*free as soon as possible*/
                        handlers = [];
                        warnedHandlers = [];
                    }
                    /*free as soon as possible*/
                    eventHandlerMap = undefined;
                }
            }
        };

        var fetchDOMNodes = function (node) {
            handleNode(node);
            for (var index = 0; index < node.childNodes.length; index++) {
                fetchDOMNodes(node.childNodes[index]);
            }
        };

        fetchDOMNodes(window.document.body);
        console.log('Done.');
})();

// Minified version
// javascript:(function checkLeak(){var e=function(e){for(var t in e){var n=undefined;if(t.match(/^jQuery\d/)&&e[t]){n=$.cache[e[t]].events}if(t.match(/^ng\d/)&&e[t]){n=angular.element.cache[e[t]].events}if(n){for(var r in n){var i=[];var s=[];for(var o=0;o<n[r].length;o++){var u;if(angular.isFunction(n[r][o])){u=n[r][o].toString()}else{u=n[r][o].handler.toString()}if(i.indexOf(u)!==-1){if(s.indexOf(u)===-1){console.log("Memory leak with this event handler : \n"+u);s.push(u)}}else{i.push(u)}}i=[];s=[]}n=undefined}}};var t=function(n){e(n);for(var r=0;r<n.childNodes.length;r++){t(n.childNodes[r])}};t(window.document.body);console.log("Done.")})();