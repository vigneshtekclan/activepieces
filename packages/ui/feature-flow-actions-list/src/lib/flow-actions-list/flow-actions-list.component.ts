import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { PopulatedFlow } from '@activepieces/shared';
import { MatDialog } from '@angular/material/dialog';

import { Observable, map, tap } from 'rxjs';
// import { GitBranchType, GitPushOperationType } from '@activepieces/ee-shared';
import {
  FolderActions,
  MoveFlowToFolderDialogComponent,
  MoveFlowToFolderDialogData,
} from '@activepieces/ui/feature-folders-store';
import {
  DeleteEntityDialogComponent,
  DeleteEntityDialogData,
  FlowService,
  ImporFlowDialogData,
  ImportFlowDialogComponent,
  UiCommonModule,
  downloadFlow,
  flowActionsUiInfo,
} from '@activepieces/ui/common';
import { Store } from '@ngrx/store';
// import { EeComponentsModule } from 'ee-components';
// import { PushFlowToGitButtonComponent } from '@activepieces/ui-feature-git-sync';
import { MatMenu } from '@angular/material/menu';
@Component({
  selector: 'ap-flow-actions-list',
  standalone: true,
  imports: [
    CommonModule,
    UiCommonModule,
    // EeComponentsModule,
    // PushFlowToGitButtonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './flow-actions-list.component.html',
})
export class FlowActionsListComponent {
  readonly flowActionsUiInfo = flowActionsUiInfo;
  hasWritePermission = true;
  @Input({ required: true }) flow!: PopulatedFlow;
  @Input() showImportAction = false;
  @Input({ required: true }) inBuilder = false;
  @Output()
  flowMoved = new EventEmitter<void>();
  @Output()
  flowDeleted = new EventEmitter<void>();
  @Output()
  renameFlow = new EventEmitter<void>();
  @Output()
  flowDuplicated = new EventEmitter<void>();
  @ViewChild(MatMenu)
  menuElement!: MatMenu;
  downloadTemplate$: Observable<void> | undefined;
  duplicateFlow$: Observable<void> | undefined;
  moveFlowDialogClosed$: Observable<unknown> | undefined;
  deleteFlowDialogClosed$: Observable<unknown> | undefined;
  constructor(
    private dialogService: MatDialog,
    private flowService: FlowService,
    private store: Store
  ) {}
  deleteFlow(flow: PopulatedFlow) {
    // MO TODO: PLEASE STOP MAKING FRONTEND DO EXTRA BACKEND WORK, BACKEND SHOULD DELETE THE FLOW AND UPDATE THE REPO INSTEAD
    const dialogData: DeleteEntityDialogData = {
      deleteEntity$: this.flowService.delete(flow.id),
      entityName: flow.version.displayName,
      note: '',
    };

    const dialogRef = this.dialogService.open(DeleteEntityDialogComponent, {
      data: dialogData,
    });

    this.deleteFlowDialogClosed$ = dialogRef.beforeClosed().pipe(
      tap((res) => {
        if (res) {
          this.deleteFlowEffect(flow.version.displayName);
        }
      }),
      map(() => {
        return void 0;
      })
    );
  }
  private deleteFlowEffect(flowDisplayName: string) {
    this.flowDeleted.emit();
    this.store.dispatch(
      FolderActions.deleteFlow({
        flowDisplayName: flowDisplayName,
      })
    );
  }
  moveFlow(flow: PopulatedFlow) {
    const data: MoveFlowToFolderDialogData = {
      flowId: flow.id,
      folderId: flow.folderId,
      flowDisplayName: flow.version.displayName,
      inBuilder: this.inBuilder,
    };
    this.moveFlowDialogClosed$ = this.dialogService
      .open(MoveFlowToFolderDialogComponent, { data })
      .afterClosed()
      .pipe(
        tap((val: boolean) => {
          if (val) {
            this.flowMoved.emit();
          }
        }),
        map(() => void 0)
      );
  }

  duplicate(flow: PopulatedFlow) {
    this.duplicateFlow$ = this.flowService
      .duplicate(flow.id)
      .pipe(tap(() => this.flowDuplicated.emit()));
  }

  export(flow: PopulatedFlow) {
    this.downloadTemplate$ = this.flowService
      .exportTemplate(flow.id, undefined)
      .pipe(
        tap(downloadFlow),
        map(() => {
          return void 0;
        })
      );
  }
  import(flowToOverWrite: PopulatedFlow) {
    const data: ImporFlowDialogData = { flowToOverwriteId: flowToOverWrite.id };
    this.dialogService.open(ImportFlowDialogComponent, { data });
  }
}

export enum GitPushOperationType {
  PUSH_FLOW = 'PUSH_FLOW',
  DELETE_FLOW = 'DELETE_FLOW',
}

export enum GitBranchType {
  PRODUCTION = 'PRODUCTION',
  DEVELOPMENT = 'DEVELOPMENT',
}
