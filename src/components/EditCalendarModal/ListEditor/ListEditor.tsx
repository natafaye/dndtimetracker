import { ReactNode, useEffect, useId, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FieldArray, useFormikContext, FormikErrors } from 'formik';
import { type CalendarListItem, Season, type TrackerCalendar } from '../../../shared/types';
import { Button, Collapse } from 'react-bootstrap';
import ListEditorItem from './ListEditorItem';
import classNames from 'classnames';
import style from "./ListEditor.module.css"
import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons';

type Props = {
    title: string
    name: keyof TrackerCalendar
    length: number
    list: CalendarListItem[]
    renderLabel?: (item: CalendarListItem, index: number, array: CalendarListItem[]) => ReactNode
    defaultName?: string
    isMonths?: boolean
}

export default function ListEditor({
    title, list, name, length, defaultName, renderLabel, isMonths = false
}: Props) {
    const [isOpen, setIsOpen] = useState(false);

    const editAreaID = useId()

    const formik = useFormikContext<TrackerCalendar>();

    // If the specified length changes, update the list to match
    useEffect(() => {
        const oldList = formik.values[name] as CalendarListItem[]
        const newList = Array(length).fill(null).map((_, index) => oldList[index] || {
            id: index + 1,
            name: defaultName,
            days: isMonths ? 30 : undefined,
            season: isMonths ? Season.Winter : undefined
        })
        formik.setFieldValue(name, newList);
    }, [length]) // eslint-disable-line react-hooks/exhaustive-deps
    // We don't want defaultName, formik, isMonths, or name as dependencies, 
    // because only a length change should trigger the list to be remade

    const errors = formik.errors[name] as FormikErrors<CalendarListItem[]>

    return (
        <div className="row">
            <div className="col-12">
                <Button type="button"
                    variant="link"
                    className="ps-0"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-expanded={isOpen}
                    aria-controls={editAreaID}
                >
                    <FontAwesomeIcon icon={(isOpen) ? faCaretDown : faCaretRight} fixedWidth className="text-primary" />
                    <span className="d-inline-block ms-1">{title}</span>
                </Button>
            </div>
            <Collapse in={isOpen} className={classNames("w-100", style.collapseableArea)}>
                <ul className="list-unstyled" id={editAreaID}>
                    <FieldArray name={name} render={() => <>
                        {isMonths &&
                            <li className="row mb-2">
                                {renderLabel &&
                                    <div className="col-2"></div>
                                }
                                <div className="col-3">
                                    <label>Name</label>
                                </div>
                                <div className="col-2">
                                    <label>Days</label>
                                </div>
                                <div className="col-2">
                                    <label>Season</label>
                                </div>
                            </li>
                        }
                        {list.map((item, index) => (
                            <ListEditorItem
                                item={item}
                                label={renderLabel && renderLabel(item, index, list)}
                                name={`${name}[${index}]`}
                                isMonth={isMonths}
                                errors={errors && errors[index]}
                                key={item.id}
                            />
                        ))}
                    </>} />
                </ul>
            </Collapse>
        </div>
    );
}