// ** React Imports
import { Fragment, lazy } from "react"
import { Navigate } from "react-router"

// ** Layouts
import BlankLayout from "@layouts/BlankLayout"
import VerticalLayout from "@src/layouts/VerticalLayout"
import HorizontalLayout from "@src/layouts/HorizontalLayout"
import LayoutWrapper from "@src/@core/layouts/components/layout-wrapper"

// ** Route Components
import PublicRoute from "@components/routes/PublicRoute"
import PrivateRoute from "@components/routes/PrivateRoute"

// ** Utils
import { isObjEmpty } from "@utils"

const getLayout = {
  blank: <BlankLayout />,
  vertical: <VerticalLayout />,
  horizontal: <HorizontalLayout />
}

// ** Document title
const TemplateTitle = "%s - Internship Management System"

// ** Default Route
const DefaultRoute = "/home"

const Home = lazy(() => import("../../pages/home/index"))
const ViewOffers = lazy(() => import("../../pages/Offers/view-offers/"))
const SecondPage = lazy(() => import("../../pages/SecondPage"))
const Login = lazy(() => import("../../pages/Login"))
const Register = lazy(() => import("../../pages/Register"))
const ForgotPassword = lazy(() => import("../../pages/ForgotPassword"))
const Error = lazy(() => import("../../pages/Error"))
const OfferWizard = lazy(() =>
  import("../../pages/Offers/create-offer/OfferWizard")
)
const CandidateForm = lazy(() =>
  import("../../pages/candidates/candidate-form/CandidateForm")
)
const Candidates = lazy(() =>
  import("../../pages/candidates/view-candidates/ViewCandidates")
)
const AccountSettings = lazy(() => import("../../pages/account-settings/index"))
const OfferPreview = lazy(() => import("../../pages/Offers/Offer/index"))
const ViewUsers = lazy(() => import("../../pages/users/view-users/ViewUsers"))
const UserView = lazy(() => import("../../pages/users/view/index"))
const Email = lazy(() => import("../../views/apps/email"))
const CandidateView = lazy(() => import("../../pages/candidates/view/index"))
// ** Merge Routes
const Routes = [
  {
    path: "/",
    element: <Navigate to={DefaultRoute} />
  },
  {
    path: "/home",
    element: <Home />,
    meta: {
      publicRoute: true
    }
  },
  {
    path: "/second-page",
    element: <SecondPage />
  },
  {
    path: "/login",
    element: <Login />,
    meta: {
      layout: "blank"
    }
  },
  {
    path: "/register",
    element: <Register />,
    meta: {
      layout: "blank"
    }
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
    meta: {
      layout: "blank"
    }
  },
  {
    path: "/error",
    element: <Error />,
    meta: {
      layout: "blank"
    }
  },
  {
    path: "/new-offer",
    element: <OfferWizard />
  },
  {
    path: "/view-offers/:id",
    element: <OfferPreview />
  },
  {
    path: "/offers/:status",
    element: <ViewOffers />
  },
  {
    path: "/candidates/new-candidate",
    element: <CandidateForm />
  },
  {
    path: "/candidates/view-candidates",
    element: <Candidates />
  },
  {
    path: "/candidates/profile/:id",
    element: <CandidateView />
  },
  {
    path: "/pages/account-settings",
    element: <AccountSettings />
  },
  {
    path: "/pages/account-page",
    element: <CandidateForm />
  },
  {
    path: "/universities/list/:status",
    element: <ViewUsers />
  },
  {
    path: "/universities/profile/:id",
    element: <UserView />
  },
  {
    path: "/pages/profile",
    element: <UserView />
  },
  {
    element: <Email />,
    path: "/apps/email",
    meta: {
      appLayout: true,
      className: "email-application"
    }
  },
  {
    element: <Email />,
    path: "/apps/email/:folder",
    meta: {
      appLayout: true,
      className: "email-application"
    }
  },
  {
    element: <Email />,
    path: "/apps/email/label/:label",
    meta: {
      appLayout: true,
      className: "email-application"
    }
  },
  {
    element: <Email />,
    path: "/apps/email/:filter"
  }
]

const getRouteMeta = (route) => {
  if (isObjEmpty(route.element.props)) {
    if (route.meta) {
      return { routeMeta: route.meta }
    } else {
      return {}
    }
  }
}

// ** Return Filtered Array of Routes & Paths
const MergeLayoutRoutes = (layout, defaultLayout) => {
  const LayoutRoutes = []

  if (Routes) {
    Routes.filter((route) => {
      let isBlank = false
      // ** Checks if Route layout or Default layout matches current layout
      if (
        (route.meta && route.meta.layout && route.meta.layout === layout) ||
        ((route.meta === undefined || route.meta.layout === undefined) &&
          defaultLayout === layout)
      ) {
        let RouteTag = PrivateRoute

        // ** Check for public or private route
        if (route.meta) {
          route.meta.layout === "blank" ? (isBlank = true) : (isBlank = false)
          RouteTag = route.meta.publicRoute ? PublicRoute : PrivateRoute
        }
        if (route.element) {
          const Wrapper =
            // eslint-disable-next-line multiline-ternary
            isObjEmpty(route.element.props) && isBlank === false
              ? // eslint-disable-next-line multiline-ternary
                LayoutWrapper
              : Fragment

          route.element = (
            <Wrapper {...(isBlank === false ? getRouteMeta(route) : {})}>
              <RouteTag route={route}>{route.element}</RouteTag>
            </Wrapper>
          )
        }

        // Push route to LayoutRoutes
        LayoutRoutes.push(route)
      }
      return LayoutRoutes
    })
  }
  return LayoutRoutes
}

const getRoutes = (layout) => {
  const defaultLayout = layout || "vertical"
  const layouts = ["vertical", "horizontal", "blank"]

  const AllRoutes = []

  layouts.forEach((layoutItem) => {
    const LayoutRoutes = MergeLayoutRoutes(layoutItem, defaultLayout)

    AllRoutes.push({
      path: "/",
      element: getLayout[layoutItem] || getLayout[defaultLayout],
      children: LayoutRoutes
    })
  })
  return AllRoutes
}

export { DefaultRoute, TemplateTitle, Routes, getRoutes }
