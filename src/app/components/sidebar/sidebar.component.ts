import { Component, OnInit } from '@angular/core';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '' },
     //{ path: '/user-profile', title: 'User Profile',  icon:'person', class: '' },
   // { path: '/table-list', title: 'Table List',  icon:'content_paste', class: '' },
    { path: '/category-list', title: 'Category List',  icon:'category', class: '' },
    { path: '/product-list', title: 'Product List',  icon:'content_paste', class: '' },
    { path: '/offers-list', title: 'Offer List',  icon:'content_paste', class: '' },
    { path: '/orders-list', title: 'Order List',  icon:'content_paste', class: '' },
    //{ path: '/orders-detail', title: 'Order Detail',  icon:'content_paste', class: '' },

];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };
}
