import { BACKEND_URL } from "../../ENVIRONMENT"
import Cookie from "js-cookie";

class Notifications {
    async getAll({pageNumber,itemPerPage}){
       let response = await fetch(`${BACKEND_URL}/api/notification/?page=${pageNumber}&paginate_by=${itemPerPage}`, {
            method: "GET",
            headers: {
              "X-CSRFToken": Cookie.get("csrftoken"),
              Accept: "application/json",
              "Content-Type": "application/json",
              "X-UseTagsOnly": true,
            },
          })
          let data =await response.text() 
          return JSON.parse(data)
 
     }
    async archive(hash){
       let response = await fetch(`${BACKEND_URL}/api/notification/read/${hash}`, {
            method: "POST",
            headers: {
              "X-CSRFToken": Cookie.get("csrftoken"),
              Accept: "application/json",
              "Content-Type": "application/json",
              "X-UseTagsOnly": true,
            },
          })
          let data =await response.text() 
          return JSON.parse(data)
 
     }
}
export const  notifications = new Notifications()