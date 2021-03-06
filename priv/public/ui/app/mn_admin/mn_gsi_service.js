import angular from "/ui/web_modules/angular.js";
import { QwQueryService } from "/_p/ui/query/angular-services/qw.query.service.js";
import {downgradeInjectable} from '/ui/web_modules/@angular/upgrade/static.js';

export default 'mnGsiService';

angular
  .module('mnGsiService', [])
  .factory('qwQueryService', downgradeInjectable(QwQueryService))
  .factory('mnGsiService', mnGsiServiceFactory);

function mnGsiServiceFactory($http, qwQueryService) {
  var mnGsiService = {
    getIndexesState: getIndexesState,
    postDropIndex: postDropIndex
  };

  return mnGsiService;

  function postDropIndex(row) {
    // to drop an index, we create a 'DROP' query to send to the query workbench
    return qwQueryService
      .executeQueryUtil('DROP INDEX `' + row.bucket + '`.`' + row.indexName + '`', true);
  }

  function getIndexesState(mnHttpParams) {
    return $http({
      method: 'GET',
      url: '/indexStatus',
      mnHttp: mnHttpParams
    }).then(function (resp) {
      var byNodes = {};
      var byBucket = {};
      var byID = {};

      resp.data.indexes.forEach(function (index) {
        byBucket[index.bucket] = byBucket[index.bucket] || [];
        byBucket[index.bucket].push(Object.assign({}, index));

        index.hosts.forEach(function (node) {
          byNodes[node] = byNodes[node] || [];
          byNodes[node].push(Object.assign({}, index));
        });
      });

      resp.data.byBucket = byBucket;
      resp.data.byNodes = byNodes;
      resp.data.byID = resp.data.indexes;

      return resp.data;
    });
  }
}
