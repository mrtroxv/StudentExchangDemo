// ** React Imports
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"

// ** Reactstrap Imports
import { Card, CardBody, Button, Toast } from "reactstrap"
import { deleteOffer, fetchAllOffers, rejectOffer, resetDeleteOfferState, selectDeleteOfferState, selectRejectOfferState } from "../../../redux/project/offers"

const PreviewActions = ({
  id,
  setSendSidebarOpen,
  setAddStudentOpen,
  status }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const rejectOfferState = useSelector(selectRejectOfferState)
  const deleteOfferState = useSelector(selectDeleteOfferState)
  const handelRejectOffer = (id) => {
    dispatch(rejectOffer(id))
  }
  const handelDeleteOffer = (id) => {
    dispatch(deleteOffer(id))
  }

  useEffect(() => {
    if (rejectOfferState.status) {
      dispatch(fetchAllOffers())
    }
    if (deleteOfferState.status) {
      dispatch(fetchAllOffers())
      dispatch(resetDeleteOfferState())
      navigate(-1)
    }

  }, [rejectOfferState.status, deleteOfferState.status])


  return (
    <Card className="invoice-action-wrapper">
      <CardBody>
        {status === 0 && (
          <Button
            color="primary"
            block
            className="mb-75"
            onClick={() => setSendSidebarOpen(true)}
          >
            {t("Send")}
          </Button>
        )}
        <Button
          color="secondary"
          tag={Link}
          to="/offers/print"
          target="_blank"
          block
          outline
          className="mb-75"
        >
          {t("Print")}
        </Button>
        {status === 0 && (
          <Button
            tag={Link}
            to={`/offers/edit/${id}`}
            color="secondary"
            block
            outline
            className="mb-75"
          >
            {t("Edit")}
          </Button>
        )}
        {status === 0 && (
          <Button
            color="danger"
            block
            outline
            className="mb-75"
            onClick={() => handelDeleteOffer(id)}
          >
            {t("Delete")}
          </Button>
        )}
        {status === 2 && (
          <Button color="success" block onClick={() => setAddStudentOpen(true)}>
            {t("AddStudent")}
          </Button>
        )}
        {status === 1 && (
          <Button color="success" block onClick={() => setAddStudentOpen(true)}>
            {t("Accept")}
          </Button>
        )}
        {status === 1 && (
          <Button color="danger" block onClick={() => handelRejectOffer(id)}>
            {t("Reject")}
          </Button>
        )}
      </CardBody>
    </Card >
  )
}

export default PreviewActions
