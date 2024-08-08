import { Injectable } from '@angular/core';
// import {
//   ConfigureRepoRequest,
//   GitBranchType,
//   GitRepo,
//   ProjectSyncPlan,
//   PullGitRepoRequest,
// } from '@activepieces/ee-shared';
// import { PushGitRepoRequest } from '@activepieces/ee-shared';
// import { environment } from '../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class SyncProjectService {
  // private prefix = `${environment.apiUrl}/git-repos`;
  // private cache$ = new Map<string, Observable<GitRepo | undefined>>();

  constructor() {
    // private authenticationService: AuthenticationService // private platformService: PlatformService, // private http: HttpClient,
    // this.authenticationService.currentUserSubject.subscribe(() =>
    //   this.cache$.clear()
    // );
  }

  // isDevelopment(): Observable<boolean> {
  //   return this.get().pipe(
  //     map((repo) => repo?.branchType === GitBranchType.DEVELOPMENT)
  //   );
  // }

  // isProduction(): Observable<boolean> {
  //   return this.get().pipe(
  //     map((repo) => repo?.branchType === GitBranchType.PRODUCTION)
  //   );
  // }

  // get(): Observable<GitRepo | undefined> {
  //   const projectId = this.authenticationService.getProjectId();
  //   const platformId = this.authenticationService.getPlatformId();
  //   assertNotNullOrUndefined(projectId, 'projectId');
  //   assertNotNullOrUndefined(platformId, 'platformId');
  //   if (!this.cache$.has(projectId)) {
  //     this.cache$.set(
  //       projectId,
  //       this.platformService.getPlatform(platformId).pipe(
  //         switchMap((platform) => {
  //           if (!platform.gitSyncEnabled) {
  //             return of(undefined);
  //           }
  //           return this.http
  //             .get<SeekPage<GitRepo>>(`${this.prefix}`, {
  //               params: {
  //                 projectId,
  //               },
  //             })
  //             .pipe(
  //               map((repos) =>
  //                 repos.data.find((repo) => repo.projectId === projectId)
  //               ),
  //               shareReplay(1)
  //             );
  //         })
  //       )
  //     );
  //   }
  //   return this.cache$.get(projectId)!;
  // }

  // configure(request: ConfigureRepoRequest) {
  //   return this.http
  //     .post<GitRepo>(this.prefix, request, {})
  //     .pipe(tap(() => this.cache$.clear()));
  // }

  // disconnect(repoId: string) {
  //   return this.http
  //     .delete<void>(`${this.prefix}/${repoId}`)
  //     .pipe(tap(() => this.cache$.clear()));
  // }

  // push(repoId: string, request: PushGitRepoRequest) {
  //   return this.http.post<void>(`${this.prefix}/${repoId}/push`, request);
  // }

  // pull(repoId: string, request: PullGitRepoRequest) {
  //   return this.http.post<ProjectSyncPlan>(
  //     `${this.prefix}/${repoId}/pull`,
  //     request
  //   );
  // }
}
