import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  /*var app = angular.module('plunkr', [])
  app.controller('UploadController', function($scope, fileReader) {
    $scope.imageSrc = "";
    
    $scope.$on("fileProgress", function(e, progress) {
      $scope.progress = progress.loaded / progress.total;
    });
  });
   HTML - <div ng-app="plunkr"></div>
*/

}
