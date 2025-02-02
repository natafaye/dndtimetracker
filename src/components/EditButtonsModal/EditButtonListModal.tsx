import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { FormLabel, Modal } from 'react-bootstrap';
import { Formik, Form, FieldArray } from 'formik';
import { selectButtonList, setButtonList } from '../../redux';
import { TrackerButton } from '../../shared/types';
import ButtonEditor from './ButtonEditor';
import { buttonListValidationSchema as validationSchema } from './buttonListValidationSchema';
import { v4 as uuid } from "uuid"

type Props = {
  show: boolean,
  toggle: () => void
}

export default function EditButtonListModal({ show, toggle }: Props) {
  const buttonList = useSelector(selectButtonList)

  const dispatch = useDispatch()

  const handleSubmit = ({ buttonList }: { buttonList: TrackerButton[] }) => {
    dispatch(setButtonList(buttonList))
    toggle()
  }

  return (
    <Modal show={show} onHide={toggle} size="lg" >
      <Modal.Header closeButton>Edit Buttons</Modal.Header>
      <Formik
        initialValues={{ buttonList: [...buttonList] }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}>
        {({ values, errors }) => (
          <Form>
            <Modal.Body className="p-4">
              <FieldArray name="buttonList">
                {(arrayHelpers) => (
                  <div>
                    <div className="row">
                      <div className="col-5 ps-3"><FormLabel>Label</FormLabel></div>
                      <div className="col-2 ps-3"><FormLabel>Minutes</FormLabel></div>
                      <div className="col-2 ps-3"><FormLabel>Hours</FormLabel></div>
                      <div className="col-2 ps-3"><FormLabel>Days</FormLabel></div>
                    </div>
                    {values.buttonList.map((button, index) => (
                      <ButtonEditor
                        key={button.id}
                        index={index}
                        remove={arrayHelpers.remove}
                        errors={Array.isArray(errors.buttonList) && typeof errors.buttonList[index] === "object" ?
                          errors.buttonList[index] :
                          undefined
                        }
                      />
                    ))}
                    <div className="row">
                      <div className="col-12">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => arrayHelpers.push({
                            id: uuid(),
                            label: 'New Button',
                            minutes: 10
                          })}
                        >
                          <FontAwesomeIcon icon={faPlus} />&nbsp;Add Button
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </FieldArray>
            </Modal.Body>
            <Modal.Footer>
              <button type="submit" className="btn btn-primary">Save</button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}