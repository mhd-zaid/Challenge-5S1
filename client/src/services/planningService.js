
const url = import.meta.env.VITE_BACKEND_URL;

const PlanningService = {
    get_plannings: async (token) => {
        try {
        const response = await fetch(`${url}/plannings`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/ld+json',
            Authorization: `Bearer ${token}`,
            },
        });
        return response;
        } catch (error) {
        console.error("An error occurred during getting all plans:", error);
        throw error;
        }
    }

};

export default PlanningService;