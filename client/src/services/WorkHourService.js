
const url = import.meta.env.VITE_BACKEND_URL;

const WorkHourService = {
    create_work_hour: async (token, data) => {
        try {
            const response = await fetch(`${url}/work_hours`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/ld+json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });
            return response;
        } catch (error) {
            console.error("An error occurred during creating work hour:", error);
            throw error;
        }
    },

    update_work_hour: async (token, id, data) => {

        try {

            const response = await fetch(`${url}/work_hours/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/merge-patch+json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });
            return response;
        } catch (error) {
            console.error("An error occurred during updating work hour:", error);
            throw error;
        }
    },
    delete_work_hour: async (token, id) => {
        try {
            const response = await fetch(`${url}/work_hours/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/ld+json',
                    Authorization: `Bearer ${token}`,
                },
            });
            return response;
        } catch (error) {
            console.error("An error occurred during deleting work hour:", error);
            throw error;
        }
    }
};

export default WorkHourService;