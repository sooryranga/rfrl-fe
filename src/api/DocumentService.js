import Vue from 'vue';


export const responseToDocument = (response) => {
  if (!response) return;

  const doc = {...response};
  if (doc.createdAt) {
    doc.createdAt = new Date(doc.createdAt);
  }

  if (doc.updatedAt) {
    doc.updatedAt = new Date(doc.updatedAt);
  }

  return doc;
};

export const DocumentService = {
  async getOrder({refId, refType}) {
    const response = await Vue.axios.get(`document-order/`, {params: {
      ref_id: refId,
      ref_type: refType,
    }});
    return response.data.map((doc) => responseToDocument(doc));
  },
  async postOrder({refId, refType, documentIds}) {
    const response = await Vue.axios.post(`document-order/`,
        {refId, refType, documentIds},
    );
    return response.data.map((doc) => responseToDocument(doc));
  },
  async putOrder({refId, refType, documentIds}) {
    const response = await Vue.axios.put(`document-order/`,
        {refId, refType, documentIds},
    );
    return response.data.map((doc) => responseToDocument(doc));
  },
  async get({id}) {
    const response = await Vue.axios.get(
        `/document/${id}/`,
    );
    return responseToDocument(response.data);
  },
  async post({src, name, description}) {
    const response = await Vue.axios.post(
        '/document/',
        {src, name, description},
    );
    return responseToDocument(response.data);
  },
  async put({id, src, name, description}) {
    const response = await Vue.axios.put(
        `/document/${id}/`,
        {src, name, description},
    );
    return responseToDocument(response.data);
  },
  async delete({id}) {
    await Vue.axios.delete(
        `/document/${id}/`,
    );
  },
};

export default {responseToDocument, DocumentService};
