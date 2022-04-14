import {useFieldArray, Controller} from 'react-hook-form'
import {FormGroup, FormControlLabel, FormControl, FormLabel, Checkbox, Radio, RadioGroup, Input} from '@mui/material'
export const ActionList = ({actionsList, control, setValue, register}) => {
    const {fields} = useFieldArray({
        control,
        name: 'actions'
    })

    const reasonsValue = [{
        label: 'Incidence pérennité',
        value: 'sustainabilityImpact'
    }, {
        label: 'Impact environnemental',
        value: 'environmentalImpact'
    }, {
        label: 'Optimisation',
        value: 'optimization'
    }]
    return (
        fields?.map((field, index) => {
                return (
                    <li key={field.id}>
                        <p>{field.name}</p>
                        <FormControl
                            {...field}
                        >
                            <FormLabel id="reasons">Raisons</FormLabel>
                            {
                                reasonsValue.map((reason, _index) => {
                                    return  (
                                        <FormControlLabel aria-labelledby="reasons" key={field.id + _index} value={reason.value} control={
                                            <input
                                                {...register(`actions.${index}.reasons`)}
                                                type='checkbox'
                                                value={reason.value}
                                            />
                                        } label={reason.label} />
                                    )
                                })
                            }
                        </FormControl>
                        {
                            <Controller
                                control={control}
                                name={`actions.${index}.delay`}
                                render={({field}) => {
                                    return (
                                        <FormControl>
                                            <FormLabel id="delay">Délai</FormLabel>
                                            <RadioGroup
                                                {...field}
                                                aria-labelledby="delay"
                                            >
                                                <FormControlLabel value="now" control={<Radio />} label="Maintenant" />
                                                <FormControlLabel value="lt2" control={<Radio />} label="Moins de deux ans" />
                                                <FormControlLabel value="lt5" control={<Radio />} label="Moins de 5 ans" />
                                                <FormControlLabel value="gt5" control={<Radio />} label="Plus que 5 ans" />
                                            </RadioGroup>
                                        </FormControl>
                                    )
                                }}
                            />
                        }
                        {
                            <Controller
                                control={control}
                                name={`actions.${index}.workCompleted`}
                                defaultValue={false}
                                render={({field}) => {
                                    return (
                                        <FormControl>
                                            <FormLabel>Travaux réalisés</FormLabel>
                                            <FormControlLabel 
                                                control={
                                                    <Checkbox
                                                    onChange={(e) => field.onChange(e.target.checked)}
                                                    checked={field.value}
                                                    defaultValue={false}
                                                    />
                                                }
                                            />
                                        </FormControl>
                                    )
                                }}
                            />
                        }
                    </li>
                )
            })
    )
}