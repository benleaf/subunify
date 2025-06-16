import { ClusterResult, StoredFile } from "@/types/server/ProjectResult";
import moment from "moment";

const SECONDS_IN_CLUSTER = 60 * 30

export class ClusterManager {
    public static getClusters(files: StoredFile[]): ClusterResult[] {
        const clusters: ClusterResult[] = []
        let nextClusterIndex = 1
        files.sort((a, b) => moment(a.fileLastModified).diff(b.fileLastModified))
        let lastFile: StoredFile | undefined

        for (const file of files) {
            const clusterMetadata = this.clusterMetadata(files[0], lastFile ?? files[0], file)
            if (clusterMetadata.isNewCluster) {
                clusters.push({
                    fileCount: 1,
                    files: [file],
                    id: file.id,
                    name: clusterMetadata.clusterStart.format("hh:mm A (MM/DD)")
                })
            } else {
                const current = clusters[clusters.length - 1]
                const sortedFiles = [...current.files, file]

                clusters[clusters.length - 1] = {
                    ...current,
                    fileCount: current.fileCount + 1,
                    files: sortedFiles,
                }

                if (current.files.length > 8) nextClusterIndex++
            }
            lastFile = file
        }

        return clusters
    }

    private static clusterMetadata(first: StoredFile, last: StoredFile, current: StoredFile) {
        const start = moment(first.fileLastModified).startOf('hour')
        const secondsToLast = moment(last.fileLastModified).diff(start, 'seconds')
        const secondsToCurrent = moment(current.fileLastModified).diff(start, 'seconds')

        const clusterIndexLast = Math.floor(secondsToLast / SECONDS_IN_CLUSTER)
        const clusterIndexCurrent = Math.floor(secondsToCurrent / SECONDS_IN_CLUSTER)

        const clusterStart = start.add(clusterIndexCurrent * SECONDS_IN_CLUSTER, 'seconds')
        const isNewCluster = clusterIndexLast != clusterIndexCurrent || first == current

        return { isNewCluster, clusterStart }
    }
}