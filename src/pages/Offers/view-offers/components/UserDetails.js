import React from "react"
import { useSelector } from "react-redux"
import {
  Card,
  CardBody,
  CardHeader,
  CardText,
  CardTitle,
  Col,
  Row
} from "reactstrap"
import { selectUser } from "../../../../redux/authentication"
import { selectUniversity } from "../../../users/store"
// import { useTranslation } from "react-i18next"

function UserDetails() {
  //   const { t } = useTranslation()
  const user = useSelector(selectUser)
  const userDetails = useSelector((state) =>
    selectUniversity(state, user.university_id)
  )

  return (
    <Card>
      <CardBody>
        <Row className="mb-3">
          <Col>
            <CardText>{userDetails?.EN_Name}</CardText>
          </Col>
          <Col>
            <CardText>{user?.username}</CardText>
          </Col>
        </Row>
        <Row>
          <Col>
            <CardText>{userDetails?.email}</CardText>
          </Col>
          <Col>
            <CardText>{userDetails?.phone}</CardText>
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}

export default UserDetails
