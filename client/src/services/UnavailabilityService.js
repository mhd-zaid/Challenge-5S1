

const url = import.meta.env.VITE_BACKEND_URL;

const create_unavailability = async (token, formData) => {
  const response = await fetch(`${url}/unavailability_hours`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/ld+json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(formData)
  });
  return response;
};

const get_unavailabilities = async (token, statuses = [], page = 1, itemsPerPage = 10, userId = null) => {
  const baseUrl = `${url}/unavailability_hours`;

  const queryParams = [
    ...statuses.map(status => `status[]=${encodeURIComponent(status)}`),
    `page=${page}`,
    `itemsPerPage=${itemsPerPage}`
  ];

  if (userId) {
    queryParams.push(`employee=${encodeURIComponent(userId)}`);
  }

  const fullUrl = `${baseUrl}?${queryParams.join('&')}`;

  const response = await fetch(fullUrl, {
    headers: {
      'Content-Type': 'application/ld+json',
      'Authorization': `Bearer ${token}`
    },
  });

  return response;
};


const delete_unavailability = async (token, id) => {
  const response = await fetch(`${url}/unavailability_hours/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/ld+json',
      'Authorization': `Bearer ${token}`
    }
  });
  return response;
}

const update_unavailability = async (token, id, formData) => {
  const response = await fetch(`${url}/unavailability_hours/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/merge-patch+json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(formData)
  });
  return response;
}


export default {
    create_unavailability,
    get_unavailabilities,
    delete_unavailability,
    update_unavailability
};
