import { ClusterResult, StoredFile } from "@/types/server/ProjectResult";
import moment from "moment";

export class ClusterManager {
    public static getClusters(files: StoredFile[]): ClusterResult[] {
        const clusters: ClusterResult[] = []
        let nextClusterIndex = 1
        files.sort((a, b) => moment(a.fileLastModified).diff(b.fileLastModified))

        for (const file of files) {
            if (clusters.length == nextClusterIndex) {
                const current = clusters[clusters.length - 1]
                const sortedFiles = [...current.files, file]
                const first = moment(sortedFiles[0].fileLastModified).format("hh:mm A (MM/DD)")

                clusters[clusters.length - 1] = {
                    ...current,
                    fileCount: current.fileCount + 1,
                    files: sortedFiles,
                    name: `${first}`
                }

                if (current.files.length > 8) nextClusterIndex++
            } else {
                clusters.push({
                    fileCount: 1,
                    files: [file],
                    id: file.id,
                    name: moment(file.fileLastModified).format("hh:mm A (MM/DD)")
                })
            }
        }

        return clusters
    }


}