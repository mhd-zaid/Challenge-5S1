
const url = import.meta.env.VITE_BACKEND_URL;

const WorkHourService = {
    create_work_hour: async (token, data) => {
        try {
            const response = await fetch(`${url}/work_hours`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });
            return response;
        } catch (error) {
            console.error("An error occurred during creating work hour:", error);
            throw error;
        }
    }

};

export default WorkHourService;