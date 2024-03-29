// eslint-disable-next-line
import React, { Fragment, useState, useEffect, useContext } from "react"
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
  Label,
  Input
} from "reactstrap"

import UserDetails from "./components/UserDetails"
import { useTranslation } from "react-i18next"
import OffersFilter from "./components/OffersFilter"
import allOffers from "@src/assets/images/svg/docs.svg"
import activeOffers from "@src/assets/images/svg/clock.svg"
import expiredOffers from "@src/assets/images/svg/expired.svg"
import DataTableWithButtons from "../../../components/custom/table/ReactTable"
import OfferWizard from "../create-offer/OfferWizard"
import { createOffer } from "../../../redux/project/offers"
import { useForm } from "react-hook-form"
import { selectUserID } from "../../../redux/authentication"
import Spinner from "../../../components/custom/loader/Spinner"
import useCols from "./useCols"
import SimpleFormDialog from "../../../components/custom/SimpleFormDialog"
import toast from "react-hot-toast"

import {
  duplicateOffer,
  getFinishedOffers,
  getOffersData,
  selectCreatedOffers,
  selectObtainedOffers,
  selectSentOffers
} from "../store"
import { SocketContext } from "../../../utility/context/Socket"

function ViewOffers() {
  const { register, watch, getValues, setValue } = useForm()
  const store = useSelector((state) => state.appOffers)
  const universities = useSelector((state) => state.users.allData.activeUsers)
  const userId = useSelector(selectUserID)
  const { status: data } = useParams()
  const { t } = useTranslation()
  const { cols, toggleDuplicateDialog, duplicateDialogData } = useCols()
  const [formModal, setFormModal] = useState(false)
  const [filter, setFilter] = useState("all")
  const dispatch = useDispatch()
  // const { socket } = useContext(SocketContext)
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
    },
    "finished-offers": {
      title: "Finished Offers",
      link: "/offers/finished-offers",
      query: (state) => state.appOffers?.allData?.finishedOffers
    }
  }

  const offersList = useSelector(breadcrumbs[data]?.query)

  useEffect(() => {
    if (data === "finished-offers") {
      dispatch(getFinishedOffers())
    } else {
      dispatch(
        getOffersData({
          id: userId
        })
      )
    }
  }, [data, offersList?.length])

  const viewTableHandler = (date) => {
    setFilter(date)
  }

  const handleOfferPopUp = () => {
    setFormModal(!formModal)
  }

  const handleCloseDuplicate = () => {
    setValue("duplicate", undefined)
    toggleDuplicateDialog()
  }

  const handleDuplicateOffer = () => {
    const number = getValues("duplicate")
    const { id } = duplicateDialogData
    const uploadData = {
      offer_id: id,
      number
    }
    toast.promise(dispatch(duplicateOffer(uploadData)), {
      loading: "Dupliating...",
      success: "Duplicate offer"
    })
    handleCloseDuplicate()
  }

  const handleAddOffer = (data) => {
    toast.promise(dispatch(createOffer(data)), {
      loading: "Creating...",
      success: () => {
        setFormModal(!formModal)
        return "Created Offer Successfully"
      },
      error: "Error"
    })
  }

  const clearData = () => {
    setFilter(offersList)
    setValue("id", "")
    setValue("college", "")
    setValue("major", "")
    setValue("university", "")
  }

  const id = watch("id")
  const college = watch("college")
  const major = watch("major")
  const university = watch("university") || ""
  const dataToRender = () => {
    const filtered = offersList?.filter((offer) => {
      switch (filter) {
        case "all":
          return true
        case "pending":
          return offer.status > 0 && offer.status <= 4
        case "active":
          return offer.status > 4 && offer.status < 8
        default:
          return true
      }
    })
    return filtered?.filter((offer) => {
      const srcUniversity = universities?.find(
        (university) => university.ID === offer.university_id_src
      )
      const dstUniversity = universities?.find(
        (university) => university.ID === offer.University_id_des
      )

      const result =
        offer?.id.toString().includes(id) &&
        offer?.college_name.toLowerCase().includes(college.toLowerCase()) &&
        offer?.major_name.toLowerCase().includes(major.toLowerCase())

      if (data === "obtained-offers") {
        return (
          result &&
          (srcUniversity?.EN_Name.toLowerCase().includes(
            university.toLowerCase()
          ) ||
            srcUniversity?.AR_Name.toLowerCase().includes(
              university.toLowerCase()
            ))
        )
      }
      if (data === "sent-offers") {
        return (
          result &&
          (dstUniversity?.EN_Name.toLowerCase().includes(
            university.toLowerCase()
          ) ||
            dstUniversity?.AR_Name.toLowerCase().includes(
              university.toLowerCase()
            ))
        )
      }

      return result
    })
  }
  const isBlank = () => {
    return id === "" && college === "" && major === "" && university === ""
  }
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
                filter="pending"
                title="Pending Offers"
                src={expiredOffers}
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
          </Row>
        </Col>
        <Col lg="6" md="12">
          <UserDetails />
        </Col>
      </Row>
      <Card>
        <CardBody>
          <Row>
            <Col lg={data !== "created-offers" ? "1" : "3"} md="6">
              <Label key="id">{t("ID")} :</Label>
              <input
                {...register("id")}
                placeholder="ID"
                type="text"
                className="form-control"
              />
            </Col>
            <Col lg={data !== "created-offers" ? "3" : "3"} md="6">
              <Label key="college">{t("college")} :</Label>
              <input
                {...register("college")}
                placeholder="College"
                type="text"
                className="form-control"
              />
            </Col>
            <Col lg={data !== "created-offers" ? "2" : "3"} md="6">
              <Label key="major">{t("major")} :</Label>
              <input
                {...register("major")}
                placeholder="Major"
                type="text"
                className="form-control"
              />
            </Col>
            {data !== "created-offers" && (
              <Col lg="3" md="6">
                <Label key="university">
                  {data === "sent-offers"
                    ? t("Destination University")
                    : t("Source University")}{" "}
                  :
                </Label>
                <input
                  {...register("university")}
                  placeholder="University"
                  type="text"
                  className="form-control"
                />
              </Col>
            )}
            <Col
              lg="3"
              md="6"
              className="p-2 d-flex justify-content-end align-items-end gap-2"
            >
              <Button outline onClick={clearData}>
                {isBlank() ? "Filter" : "Reset"}
              </Button>
              <Button color="primary" onClick={handleOfferPopUp}>
                {t("createOffer")}
              </Button>
            </Col>
          </Row>
        </CardBody>
        {store.isLoading && <Spinner />}
        {!store.isLoading && (
          <DataTableWithButtons
            data={dataToRender()}
            columns={cols[data]}
            clickAttr="id"
            link="/view-offers"
          />
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
              outerSubmit={handleAddOffer}
              type="modern-vertical"
              onClose={() => setFormModal(!formModal)}
            />
          </ModalBody>
        </Modal>
      )}
      {duplicateDialogData.isOpen && (
        <SimpleFormDialog
          open={duplicateDialogData.isOpen}
          toggleModal={handleCloseDuplicate}
          handleSubmit={handleDuplicateOffer}
        >
          <Col md="12">
            <Label key="duplicate">{t("Chose a Number")} :</Label>
            <input
              {...register("duplicate")}
              placeholder="#"
              type="number"
              className="form-control"
            />
          </Col>
        </SimpleFormDialog>
      )}
      {
        // <ToastContainer />
      }
    </Fragment>
  )
}

export default ViewOffers
