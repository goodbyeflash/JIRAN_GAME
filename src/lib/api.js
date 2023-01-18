import axios from 'axios';

const { API_KEY } = process.env;

export default async function callApi(method, url, data, cb) {
  axios.defaults.headers['X-API-KEY'] = API_KEY;
  const option = {
    method: method,
    url: `${window.location.protocol}//${window.location.hostname}/api/${url}`,
    withCredentials: true,
    responseType: url.indexOf('excel') > -1 ? 'blob' : 'json',
  };
  if (data) option.data = data;
  axios(option)
    .then((result) => {
      cb && cb({ result: result, msg: 'OK' });
    })
    .catch((error) => {
      cb && cb({ result: error, msg: 'ERROR' });
    });
}
