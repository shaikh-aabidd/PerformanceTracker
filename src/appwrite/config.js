import { Client, Databases, Query } from "appwrite";
import conf from "../conf/conf";
import { useSelector } from 'react-redux';

class GraphDataService {
    client = new Client();
    databases;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteApiEndpoint)
            .setProject(conf.appwriteProjectId)

        this.databases = new Databases(this.client);
    }

    async saveGraphData({ userId, studyHours, date, compositeKey }) {
        try {
            const existingDocuments = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                [
                    Query.equal("compositeKey",compositeKey)
                ]
            )

            if (existingDocuments.total > 0) {
                const existingDocument = existingDocuments.documents[0];
                const updatedDocument = await this.databases.updateDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteCollectionId,
                    existingDocument.$id,
                    { studyHours },
                )
                return updatedDocument;
            } else {
                const response = await this.databases.createDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteCollectionId,
                    compositeKey,
                    {
                        userId,
                        studyHours,
                        date,
                        compositeKey,
                    }
                )
                return response;
            }


        } catch (error) {
            console.log("Appwrite serive :: createPost/updatePost :: error", error);
        }
    }

    async getStudyHoursAndDate(userId) {
        try {
            const response = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                [Query.equal("userId", userId)]
            );
    
            const documents = response.documents;
            const hoursAndDate = documents.map((document) => ({
                studyHours: document.studyHours,
                date: document.date,
            }));
    
            return hoursAndDate || [];
        } catch (error) {
            console.log("Appwrite service :: getStudyHoursAndDate :: error", error);
            return [];
        }
    }
    
}

const graphService = new GraphDataService();
export default graphService;