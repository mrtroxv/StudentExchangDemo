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
import { useTranslation } from "react-i18next"
import DataTable from "../../../components/custom/table/ReactTable"
// import { selectAllUniversities } from "../../../redux/project/universities"
import { useDispatch, useSelector } from "react-redux"
// import DataTable from "react-data-table-component"
import { ChevronDown } from "react-feather"
import { useForm } from "react-hook-form"
import CandidateForm from "../candidate-form/CandidateForm"
import useCols from "./useCols"
import { getAllData } from "../store"
import Spinner from "../../../components/custom/loader/Spinner"

const ViewCandidates = () => {
  const { register, setValue, watch } = useForm()
  const { cols } = useCols()
  const dispatch = useDispatch()
  const store = useSelector((state) => state.candidates)
  const { t } = useTranslation()
  const [formModal, setFormModal] = useState(false)

  useEffect(() => {
    dispatch(getAllData())
  }, [dispatch, store.allData.length])

  const id = watch("id")
  const name = watch("name")
  const email = watch("email")

  const dataToRender = () => {
    if (store.allData.length === 0) return []
    const { users } = store.allData
    const data = users
      ?.filter((item) => item !== undefined)
      ?.filter(
        (item) =>
          item?.ID.toString().includes(id) &&
          item?.name.toLowerCase().includes(name.toLowerCase()) &&
          item?.email.toLowerCase().includes(email.toLowerCase())
      )
    if (data?.length > 0) {
      return data
    }
    return []
  }
  const clearData = () => {
    setFilteredData(candidates)
    setValue("id", "")
    setValue("name", "")
    setValue("email", "")
    // setValue("phone", "")
  }
  const isBlank = () => {
    return id === "" && name === "" && email === ""
  }
  return (
    <>
      <Breadcrumbs
        title={t("Candidates")}
        data={[{ title: t("list"), link: "/candidates" }]}
      />
      <Row>
        <Col>
          <Card>
            <CardHeader>
              <CardTitle>{t("Filters")}</CardTitle>
            </CardHeader>
            <CardBody>
              <Row>
                <Col lg="8" md="8">
                  <Row>
                    <Col lg="4" md="6">
                      <Label key="id">{t("id")} :</Label>
                      <input
                        {...register("id")}
                        placeholder="ID"
                        type="text"
                        className="form-control"
                      />
                    </Col>
                    <Col lg="4" md="6">
                      <Label key="name">{t("university")} :</Label>
                      <input
                        {...register("name")}
                        placeholder="University Name"
                        type="text"
                        className="form-control"
                      />
                    </Col>
                    <Col lg="4" md="6">
                      <Label key="email">{t("email")}:</Label>
                      <input
                        {...register("email")}
                        placeholder="Email Address"
                        type="text"
                        className="form-control"
                      />
                    </Col>
                  </Row>
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
            {t("Add Candidate")}
          </ModalHeader>
          <ModalBody>
            <CandidateForm
              // outerSubmit={handleOfferPopUp}
              type="modern-vertical"
              onClose={() => setFormModal(!formModal)}
            />
          </ModalBody>
        </Modal>
      )}
    </>
  )
}

export default ViewCandidates
