// eslint-disable-next-line
import React, { Fragment, useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import Breadcrumbs from "@components/breadcrumbs"
import {
  Card,
  CardBody,
  Row,
  Col,
  Button,
  ModalHeader,
  Modal,
  ModalBody,
  Label
} from "reactstrap"

import UserDetails from "./components/UserDetails"
import { useTranslation } from "react-i18next"
import OffersFilter from "./components/OffersFilter"
import allOffers from "@src/assets/images/svg/docs.svg"
import activeOffers from "@src/assets/images/svg/clock.svg"
import expiredOffers from "@src/assets/images/svg/expired.svg"
import DataTableWithButtons from "../../../components/custom/table/ReactTable"
import OfferWizard from "../create-offer/OfferWizard"
import {
  fetchAllOffers,
  selectCreatedOffers,
  selectIsLoadingOffers,
  selectObtainedOffers,
  selectSentOffers
} from "../../../redux/project/offers"
import { useForm } from "react-hook-form"
import { selectUserID } from "../../../redux/authentication"
import Spinner from "../../../components/custom/loader/Spinner"
import useCols from "./useCols"
// import { selectIsLoadingStudents } from "../../../redux/project/students"

function ViewOffers() {
  const { register, watch } = useForm()
  const userId = useSelector(selectUserID)
  const isLoading = useSelector(selectIsLoadingOffers)
  const { status: data } = useParams()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { cols } = useCols()
  const [formModal, setFormModal] = useState(false)
  const [filteredData, setFilteredData] = useState([])

  const breadcrumbs = {
    "created-offers": {
      title: "Created Offers",
      link: "/offers/created-offers",
      query: (state) => selectCreatedOffers(state, +userId),
      cols: ["ID", "college", "major", "status", "date", "actions"]
    },
    "sent-offers": {
      title: "Sent Offers",
      link: "/offers/sent-offers",
      query: (state) => selectSentOffers(state, +userId),
      cols: [
        "ID",
        "college",
        "major",
        "status",
        "date",
        "university_id_des",
        "actions"
      ]
    },
    "obtained-offers": {
      title: "Obtained Offers",
      link: "/offers/obtained-offers",
      query: (state) => selectObtainedOffers(state, +userId),
      cols: [
        "ID",
        "college",
        "major",
        "status",
        "date",
        "university_id_src",
        "actions"
      ]
    }
  }
  const offersList = useSelector(breadcrumbs[data].query)

  useEffect(() => {
    dispatch(fetchAllOffers())
    setFilteredData(offersList)
  }, [])

  const viewTableHandler = (date) => {
    if (date === "all") {
      setFilteredData(offersList)
    } else if (date === "active") {
      setFilteredData(
        offersList.filter((offer) => offer.status === 0 || offer.status === 1)
      )
    } else if (date === "expired") {
      setFilteredData(
        offersList.filter((offer) => offer.status === 2 || offer.status === 3)
      )
    }
  }

  const handleOfferPopUp = () => {
    setFormModal(!formModal)
  }

  const id = watch("id")
  const college = watch("college")
  const major = watch("major")
  const universityID = watch("university_id") || ""
  const offers = filteredData.filter((offer) => {
    return (
      offer.id.toString().includes(id) &&
      offer.college_name.toLowerCase().includes(college.toLowerCase()) &&
      offer.major_name.toLowerCase().includes(major.toLowerCase()) &&
      (offer.university_id_des?.toString().includes(String(universityID)) ||
        offer.university_id_src?.toString().includes(String(universityID)))
    )
  })

  return (
    <Fragment>
      <Breadcrumbs
        title={`${t("Offers")}`}
        data={[
          { title: t("Offers"), link: "/Offers" },
          { title: t(breadcrumbs[data].title), link: breadcrumbs[data].link }
        ]}
      />
      <Row className="match-height">
        <Col lg="6" md="12">
          <Row className="match-height">
            <Col lg="4" md="4">
              <OffersFilter
                onView={viewTableHandler}
                filter="all"
                title="All Offers"
                src={allOffers}
              />
            </Col>
            <Col lg="4" md="4" xs="4">
              <OffersFilter
                onView={viewTableHandler}
                filter="active"
                title="Active Offers"
                src={activeOffers}
              />
            </Col>
            <Col lg="4" md="4" xs="4">
              <OffersFilter
                onView={viewTableHandler}
                filter="expired"
                title="Expired Offers"
                src={expiredOffers}
              />
            </Col>
          </Row>
        </Col>
        <Col lg="6" md="12">
          <UserDetails />
        </Col>
      </Row>
      <Card>
        <CardBody>
          <Row>
            <Col lg="10" md="8">
              <Row>
                <Col lg={data === "created-offers" ? "4" : "3"} md="6">
                  <Label key="id">{t("ID")} :</Label>
                  <input
                    {...register("id")}
                    placeholder="ID"
                    type="text"
                    className="form-control"
                  />
                </Col>
                <Col lg={data === "created-offers" ? "4" : "3"} md="6">
                  <Label key="college_name">{t("college")} :</Label>
                  <input
                    {...register("college")}
                    placeholder="College"
                    type="text"
                    className="form-control"
                  />
                </Col>
                <Col lg={data === "created-offers" ? "4" : "3"} md="6">
                  <Label key="major_name">{t("major")} :</Label>
                  <input
                    {...register("major")}
                    placeholder="Major"
                    type="text"
                    className="form-control"
                  />
                </Col>
                {data !== "created-offers" && (
                  <Col lg="3" md="6">
                    <Label key="university_id">
                      {data === "sent-offers"
                        ? t("Destination University")
                        : t("Source University")}{" "}
                      :
                    </Label>
                    <input
                      {...register("university_id")}
                      placeholder="University"
                      type="text"
                      className="form-control"
                    />
                  </Col>
                )}
              </Row>
            </Col>
            <Col lg="2" md="4">
              <Button
                color="primary"
                className="m-2"
                onClick={handleOfferPopUp}
              >
                {t("createOffer")}
              </Button>
            </Col>
          </Row>
        </CardBody>
        {isLoading && <Spinner />}
        {!isLoading && (
          <DataTableWithButtons data={offers} columns={cols[data]} />
        )}
      </Card>
      {formModal && (
        <Modal
          isOpen={formModal}
          toggle={() => setFormModal(!formModal)}
          className="modal-dialog-centered modal-lg"
        >
          <ModalHeader
            toggle={() => setFormModal(!formModal)}
            className="modal-lg"
          >
            {t("createOffer")}
          </ModalHeader>
          <ModalBody>
            <OfferWizard
              outerSubmit={handleOfferPopUp}
              type="modern-vertical"
              onClose={() => setFormModal(!formModal)}
            />
          </ModalBody>
        </Modal>
      )}
      {
        // <ToastContainer />
      }
    </Fragment>
  )
}

export default ViewOffers
