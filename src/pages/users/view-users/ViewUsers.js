import React, { useEffect, useState } from "react"
import Breadcrumbs from "@components/breadcrumbs"
import {
  Row,
  Col,
  Card,
  CardTitle,
  CardBody,
  CardHeader,
  Label,
  Button,
  Modal,
  ModalHeader,
  ModalBody
} from "reactstrap"
import "../../../components/custom/table/react-dataTable-component.scss"

import { useTranslation } from "react-i18next"
// import DataTable from "../../../components/custom/table/ReactTable"
import DataTable from "react-data-table-component"

// import { selectAllUniversities } from "../../../redux/project/universities"
// import { useSelector } from "react-redux"
// import DataTable from "react-data-table-component"

// import { selectAllUniversities } from "../../../redux/project/universities"
import { useForm } from "react-hook-form"
import { ChevronDown } from "react-feather"
import NewUser from "../create-user/index"
import useCols from "./useCols"
import Spinner from "../../../components/custom/loader/Spinner"
import { getAllData } from "../store"
import { useDispatch, useSelector } from "react-redux"
import toast from "react-hot-toast"
import { useParams } from "react-router-dom"

const ViewUsers = () => {
  const { register, watch, setValue } = useForm()
  const store = useSelector((state) => state.users)
  const [formModal, setFormModal] = useState(false)
  const { t } = useTranslation()
  const { cols } = useCols()
  const dispatch = useDispatch()
  const { status } = useParams()
  // use selector to select universities
  //   const universities = useSelector(selectAllUniversities)
  useEffect(() => {
    toast.promise(dispatch(getAllData()), {
      loading: "modal",
      success: "success",
      error: "error"
    })
  }, [dispatch, store.allData?.length])

  const name = watch("name")
  const email = watch("email")
  const phone = watch("phone")

  const clearData = () => {
    setValue("name", "")
    setValue("email", "")
    setValue("phone", "")
  }

  const isBlank = () => {
    return name === "" && email === "" && phone === ""
  }

  const dataToRender = () => {
    if (
      (store.allData?.activeUsers?.length === 0 &&
        store.allData?.suspendedUsers?.length === 0) ||
      store.isLoading
    ) {
      return []
    }
    const active = store.allData.activeUsers
    const suspended = store.allData.suspendedUsers
    if (active?.length > 0 || suspended?.length > 0) {
      switch (status) {
        case "active":
          return active
            ?.filter((item) => item !== undefined)
            ?.filter(
              (item) =>
                item?.EN_Name?.toLowerCase().includes(name?.toLowerCase()) &&
                item?.AR_Name?.toLowerCase().includes(name?.toLowerCase()) &&
                item?.email?.toLowerCase().includes(email?.toLowerCase()) &&
                item?.phone?.includes(phone)
            )
        case "suspended":
          return suspended
            ?.filter((item) => item !== undefined)
            ?.filter(
              (item) =>
                item?.EN_Name?.toLowerCase().includes(name?.toLowerCase()) &&
                item?.AR_Name?.toLowerCase().includes(name?.toLowerCase()) &&
                item?.email?.toLowerCase().includes(email?.toLowerCase()) &&
                item?.phone?.includes(phone)
            )
      }
    }
    return []
  }
  return (
    <>
      <Breadcrumbs
        title={`${t("Universities")}`}
        data={[{ title: t("list"), link: "/universities/list" }]}
      />
      <Row>
        <Col>
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardBody>
              <Row className="match-height">
                <Col>
                  <Row className="d-flex justify-content-end">
                    <Col lg="3" sm="6">
                      <Label key="name">{t("University Name")} :</Label>
                      <input
                        {...register("name")}
                        placeholder="University Name"
                        type="text"
                        className="form-control"
                      />
                    </Col>
                    <Col lg="3" sm="6">
                      <Label key="email">{t("Email Address")} :</Label>
                      <input
                        {...register("email")}
                        placeholder="Email Address"
                        type="email"
                        className="form-control"
                      />
                    </Col>
                    <Col lg="3" sm="6">
                      <Label key="phone">{t("Phone Number")} :</Label>
                      <input
                        {...register("phone")}
                        placeholder="Phone Number"
                        type="number"
                        className="form-control"
                      />
                    </Col>
                    <Col
                      lg="3"
                      sm="6"
                      className="d-flex justify-content-end align-items-end gap-2"
                    >
                      <Button outline onClick={clearData}>
                        {isBlank() ? t("Filter") : t("Reset")}
                      </Button>
                      <Button
                        color="primary"
                        onClick={() => {
                          setFormModal(!formModal)
                        }}
                      >
                        {t("Add")}
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </CardBody>
            {store.isLoading ? (
              <Spinner />
            ) : (
              <>
                <DataTable
                  noHeader
                  pagination
                  responsive
                  columns={cols}
                  sortIcon={<ChevronDown />}
                  className="react-dataTable"
                  data={dataToRender()}
                />
              </>
            )}
          </Card>
        </Col>
      </Row>
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
            {t("Create New User")}
          </ModalHeader>
          <ModalBody>
            <NewUser
              outerSubmit={() => {}}
              type="modern-horizontal"
              onClose={() => setFormModal(!formModal)}
            />
          </ModalBody>
        </Modal>
      )}
    </>
  )
}

export default ViewUsers
