import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppRoutes } from './app.routing';
import { AppComponent } from './app.component';


// tslint:disable-next-line:max-line-length
import { CondensedComponent, BlankComponent, RootLayout, CorporateLayoutComponent, SimplyWhiteLayout, ExecutiveLayout, CasualLayout } from './@pages/layouts';
import { pagesToggleService } from './@pages/services/toggler.service';

import { SidebarComponent } from './@pages/components/sidebar/sidebar.component';
import { QuickviewComponent } from './@pages/components/quickview/quickview.component';
import { QuickviewService } from './@pages/components/quickview/quickview.service';
import { SearchOverlayComponent } from './@pages/components/search-overlay/search-overlay.component';
import { HeaderComponent } from './@pages/components/header/header.component';
import { HorizontalMenuComponent } from './@pages/components/horizontal-menu/horizontal-menu.component';
import { SharedModule } from './@pages/components/shared.module';
import { pgListViewModule } from './@pages/components/list-view/list-view.module';
import { pgCardModule } from './@pages/components/card/card.module';
import { pgCardSocialModule } from './@pages/components/card-social/card-social.module';

import {
  BsDropdownModule,
  AccordionModule,
  AlertModule,
  ButtonsModule,
  CollapseModule,
  ModalModule,
  ProgressbarModule,
  TabsModule,
  TooltipModule,
  TypeaheadModule,
} from 'ngx-bootstrap';

import { pgTabsModule } from './@pages/components/tabs/tabs.module';
import { pgSwitchModule } from './@pages/components/switch/switch.module';
import { ProgressModule } from './@pages/components/progress/progress.module';

import { pgSelectModule } from './@pages/components/select/select.module';

import { pgTimePickerModule } from './@pages/components/time-picker/timepicker.module';

import { pgSelectfx } from './@pages/components/cs-select/select.module';
import { pgDatePickerModule } from './@pages/components/datepicker/datepicker.module';
import { ToastrModule } from 'ng6-toastr-notifications';

import { NvD3Module } from 'ngx-nvd3';
import { NgxEchartsModule } from 'ngx-echarts';
import { IsotopeModule } from 'ngx-isotope';
import { NgxDnDModule } from '@swimlane/ngx-dnd';
import { LoadingModule } from 'ngx-loading';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { QuillModule } from 'ngx-quill';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { CorporateDashboardComponent } from './dashboard/dashboard.component';

import { BlankCorporateComponent } from './@pages/layouts/blank-corporate/blank-corporate.component';
import { BlankSimplywhiteComponent } from './@pages/layouts/blank-simplywhite/blank-simplywhite.component';
import { BlankCasualComponent } from './@pages/layouts/blank-casual/blank-casual.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { ManageBeneficiariesComponent } from './manage-beneficiaries/manage-beneficiaries.component';
import { TrackPaymentsComponent } from './track-payments/track-payments.component';
import { BeneficiaryService } from './shared/services/beneficiary.service';
import { TrackPaymentService } from './shared/services/track-payment.service';
import { EmailService } from './shared/services/email.service';
import { ProfileService } from './shared/services/profile.service';
import { AuthenticationService } from './shared/services/authentication.service';
import { AuthGuard } from './shared/guards/auth.guard';
import { GenericService } from './shared/services/generic.service';
import { SedolpayStateManagerService } from './shared/services/sedolpay-state-manager.service';
import { EncrDecrService } from './shared/services/encr-decr.service';
import { AccountService } from './manage-accounts/shared/services/account.service';
import { AppConfigService } from './shared/services/app-config.service';
import { CookiesStorageService, WebStorageModule } from 'ngx-store';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

export class AppHammerConfig extends HammerGestureConfig {
  overrides = <any>{
    'pinch': { enable: false },
    'rotate': { enable: false }
  };
}

@NgModule({
  declarations: [
    AppComponent,
    CondensedComponent,
    CorporateLayoutComponent,
    SimplyWhiteLayout,
    ExecutiveLayout,
    CasualLayout,
    SidebarComponent,
    QuickviewComponent,
    SearchOverlayComponent, HeaderComponent,
    HorizontalMenuComponent,
    BlankComponent,
    RootLayout,
    CorporateDashboardComponent,
    BlankCorporateComponent,
    BlankSimplywhiteComponent,
    BlankCasualComponent,
    ContactUsComponent,
    MyProfileComponent,
    ManageBeneficiariesComponent,
    TrackPaymentsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    SharedModule,
    LoadingModule,
    NgbModule,
    ProgressModule,
    pgListViewModule,
    pgCardModule,
    pgCardSocialModule,
    RouterModule.forRoot(AppRoutes),
    BsDropdownModule.forRoot(),
    AccordionModule.forRoot(),
    AlertModule.forRoot(),
    ButtonsModule.forRoot(),
    CollapseModule.forRoot(),
    ModalModule.forRoot(),
    ProgressbarModule.forRoot(),
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    TypeaheadModule.forRoot(),
    ToastrModule.forRoot(),
    NvD3Module,
    pgTabsModule,
    NgxEchartsModule,
    IsotopeModule,
    NgxDnDModule,
    QuillModule,
    PerfectScrollbarModule,
    pgSwitchModule,
    pgSelectModule,
    pgSelectfx,
    pgDatePickerModule,
    pgTimePickerModule,
    WebStorageModule
  ],
  providers: [AuthenticationService, GenericService, CookiesStorageService, SedolpayStateManagerService, AuthGuard, EncrDecrService,
    AccountService, BeneficiaryService, TrackPaymentService, EmailService, ProfileService, QuickviewService, AppConfigService,
    pagesToggleService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: AppHammerConfig
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initAppConfig,
      deps: [AppConfigService],
      multi: true
    }],
  bootstrap: [AppComponent],
})
export class AppModule { }

export function initAppConfig(appConfig: AppConfigService) {
  return () => appConfig.loadConfiguration();
}
