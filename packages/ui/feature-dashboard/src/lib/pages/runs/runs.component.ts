import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  EmbeddingService,
  PlatformService,
  UiCommonModule,
  executionsPageFragments,
} from '@activepieces/ui/common';
import { RunsTableComponent } from '../../components/runs-table/runs-table.component';
// import { IssuesTableComponent } from '../../components/issues-table/issues-table.component';
import { TabsPageCoreComponent } from '../../components/tabs-page-core/tabs-page-core.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
// import { PopulatedIssue } from '@activepieces/ee-shared';
import { IssuesService } from '../../services/issues.service';
import { Observable, take } from 'rxjs';

@Component({
  selector: 'app-executions',
  standalone: true,
  imports: [
    CommonModule,
    UiCommonModule,
    RunsTableComponent,
    // IssuesTableComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class=" ap-px-[30px] ap-pt-[50px]">
      @if(isInEmbedding$ | async) {
      <app-runs-table #runsTable></app-runs-table>
      } @else() {

      <mat-tab-group
        #tabs
        (selectedTabChange)="tabChanged($event)"
        class="ap-gap-4"
        dynamicHeight
        mat-stretch-tabs="false"
        mat-align-tabs="start"
        animationDuration="0"
      >
        <mat-tab i18n-label label="All Runs">
          <div class="ap-mt-1">
            <app-runs-table #runsTable></app-runs-table>
          </div>
        </mat-tab>
      </mat-tab-group>
      }
    </div>
    @if(fragmentChanged$ | async){}
  `,
})
export class RunsComponent
  extends TabsPageCoreComponent
  implements AfterViewInit
{
  @ViewChild('tabs') tabGroupView?: MatTabGroup;
  @ViewChild('runsTable') runsTable?: RunsTableComponent;
  // @ViewChild('IssuesTable') IssuesTable?: IssuesTableComponent;
  isThereAnIssue$: Observable<boolean>;
  isIssuesDisabled$: Observable<boolean>;
  isInEmbedding$: Observable<boolean>;

  constructor(
    router: Router,
    route: ActivatedRoute,
    private issuesService: IssuesService,
    private platformService: PlatformService,
    private embeddingService: EmbeddingService
  ) {
    super(
      [
        {
          fragmentName: executionsPageFragments.Runs,
        },
        {
          fragmentName: executionsPageFragments.Issues,
        },
      ],
      router,
      route
    );
    this.isThereAnIssue$ =
      this.issuesService.shouldShowIssuesNotificationIconInSidebarObs$;
    this.isIssuesDisabled$ = this.platformService.issuesDisabled();
    this.isInEmbedding$ = this.embeddingService
      .getIsInEmbedding$()
      .pipe(take(1));
  }
  ngAfterViewInit(): void {
    if (!this.embeddingService.getIsInEmbedding()) {
      this.tabGroup = this.tabGroupView;
      this.afterViewInit();
    }
  }
  override tabChanged(event: MatTabChangeEvent) {
    if (event.index < 0 || event.index >= this.tabIndexFragmentMap.length) {
      console.warn('tab index out of bounds');
      return;
    }
    if (
      this.route.snapshot.fragment !==
      this.tabIndexFragmentMap[event.index].fragmentName
    ) {
      // const queryParams =
      //   event.index === 0
      //     ? this.runsTable?.getCurrentQueryParams()
      //     : this.runsTable?.getCurrentQueryParams();
      // this.updateFragment(
      //   this.tabIndexFragmentMap[event.index].fragmentName,
      //   queryParams ?? {}
      // );
    }
  }

  // issueClicked(issue: PopulatedIssue) {
  //   const runsTabIndex = this.tabIndexFragmentMap.findIndex(
  //     (i) => i.fragmentName === executionsPageFragments.Runs
  //   );
  //   if (this.tabGroup) {
  //     this.tabGroup.selectedIndex = runsTabIndex;
  //   }
  //   this.runsTable?.setParams(
  //     [
  //       FlowRunStatus.FAILED,
  //       FlowRunStatus.TIMEOUT,
  //       FlowRunStatus.INTERNAL_ERROR,
  //       FlowRunStatus.QUOTA_EXCEEDED,
  //     ],
  //     issue.flowId,
  //     issue.created
  //   );
  // }

  goToAlerts() {
    this.router.navigate(['/settings'], { fragment: 'Alerts' });
  }
}
