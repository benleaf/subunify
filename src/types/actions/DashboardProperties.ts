import { Bundle } from "../Bundle"
import { Collaborator } from "../Collaborator"
import { ProjectPreviewResult, ProjectResult, ClusterResult } from "../server/ProjectResult"

export type DashboardProperties = {
    projects: ProjectPreviewResult[],
    bundles: Bundle[],
    selectedBundle: Bundle,
    selectedBundleId: string,
    selectedProjectId: string,
    selectedProject?: ProjectResult,
    selectedCluster: ClusterResult,
    projectRole?: Collaborator['role'],
    collaborators?: Collaborator[],
    page: 'projects' |
    'project' |
    'cluster' |
    'bundle' |
    'statistics' |
    'billing' |
    'settings' |
    'upload' |
    'account' |
    'addStorage' |
    'createProject' |
    'download' |
    'manageProject' |
    'advancedFileSettings' |
    'manageCollaborators'
}