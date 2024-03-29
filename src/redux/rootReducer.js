// ** Reducers Imports
import navbar from "./navbar"
import layout from "./layout"
import auth from "./authentication"
import notifications from "./project/notification"
import users from "../pages/users/store"
import candidates from "../pages/candidates/store"
import appOffers from "../pages/Offers/store"
// import todo from "@src/views/apps/todo/store"
import chat from "@src/views/apps/chat/store"
import email from "@src/views/apps/email/store"
// import kanban from "@src/views/apps/kanban/store"
// import invoice from "@src/views/apps/invoice/store"
import calendar from "@src/views/apps/calendar/store"
// import ecommerce from "@src/views/apps/ecommerce/store"
// import dataTables from "@src/views/tables/data-tables/store"
// import permissions from "@src/views/apps/roles-permissions/store"

const rootReducer = {
  auth,
  // todo,
  chat,
  // kanban,
  navbar,
  layout,
  // invoice,
  calendar,
  // ecommerce,
  // dataTables,
  // permissions,
  email,
  users,
  candidates,
  appOffers,
  notifications
}

export default rootReducer
