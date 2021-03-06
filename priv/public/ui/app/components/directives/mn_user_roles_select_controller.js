import angular from "/ui/web_modules/angular.js";

export default "mnUserRolesSelect";

angular
  .module('mnUserRolesSelect', [])
  .directive('mnUserRolesSelect', mnUserRolesSelectDirective)
  .directive('mnUserRolesSelectForm', mnUserRolesSelectFormDirective);

function mnUserRolesSelectDirective() {
  var mnUserRolesSelect = {
    restrict: 'E',
    templateUrl: 'app/components/directives/mn_user_roles_select.html',
    controller: mnUserRolesSelectController,
    scope: {
      state: "="
    }
  };

  return mnUserRolesSelect;

  function mnUserRolesSelectController($scope) {

    $scope.toggleWrapper = toggleWrapper;
    $scope.hasSelectedItems = hasSelectedItems;
    $scope.hasSelectedConfigs = hasSelectedConfigs;
    $scope.isRoleDisabled = isRoleDisabled;

    function isRoleDisabled(role) {
      return role.role !== 'admin' && $scope.state.selectedRoles["admin"];
    }

    function toggleWrapper(name) {
      $scope.state.openedWrappers[name] = !$scope.state.openedWrappers[name];
    }

    function hasSelectedItems(name) {
      return $scope.state.folders.find(o => o.name == name).roles.find(o => {
        let groups = ($scope.state.selectedGroupsRoles &&
                      $scope.state.selectedGroupsRoles[o.role]);
        return $scope.state.selectedRoles[o.role] ||
          (groups && groups.length) ||
          hasSelectedConfigs(o.role);
      });
    }

    function hasSelectedConfigs(name) {
      let config = $scope.state.selectedRolesConfigs[name];
      let groupConfigs = Object.values(($scope.state.selectedGroupsRolesConfigs &&
                                        $scope.state.selectedGroupsRolesConfigs[name]) || {});
      return (config && config.length) || groupConfigs.find(v => v.length);
    }

  }
}

function mnUserRolesSelectFormDirective() {
  var mnUserRolesSelectForm = {
    restrict: 'AE',
    templateUrl: 'app/components/directives/mn_user_roles_select_form.html',
    controller: mnUserRolesSelectFormController,
    scope: {
      item: "=",
      state: "="
    }
  };

  return mnUserRolesSelectForm;

  function mnUserRolesSelectFormController($scope) {
    $scope.form = {init: {children: {}}};
    $scope.form.init.children[$scope.item.params[0]] =
      $scope.state.parameters[$scope.item.params[0]];

    var rolesConfigs = $scope.state.selectedRolesConfigs[$scope.item.role] || [];
    $scope.state.selectedRolesConfigs[$scope.item.role] = rolesConfigs;

    $scope.submit = submit;
    $scope.del = del;
    $scope.isRoleDisabled = isRoleDisabled;
    $scope.isSelectDisabled = isSelectDisabled;
    $scope.changeParams = changeParams;

    function isSelectDisabled($index) {
      var headParam = $scope.item.params[$index - 1];
      return headParam && !$scope.form[headParam];
    }

    function isRoleDisabled(role) {
      return role.role !== 'admin' && $scope.state.selectedRoles["admin"];
    }

    function changeParams(param) {
      if ((param == "bucket_name") &&
          $scope.form["bucket_name"] &&
          $scope.form["scope_name"] !== undefined &&
         $scope.form["collection_name"] !== undefined) {
        $scope.form["scope_name"] = "*";
        $scope.form["collection_name"] = "*";
      }

      if ((param == "scope_name") &&
          $scope.form["collection_name"] !== undefined) {
        $scope.form["collection_name"] = "*";
      }
    }

    function del(cfg) {
      rolesConfigs.splice(rolesConfigs.indexOf(cfg), 1);
    }

    function submit() {
      let cfg = $scope.item.params.map(param =>
                                       ($scope.form[param] || {}).value || "*").join(":");
      if (rolesConfigs.includes(cfg)) {
        return;
      }
      rolesConfigs.unshift(cfg);
      $scope.item.params.forEach(param => ($scope.form[param] = null));
    }
  }
}
