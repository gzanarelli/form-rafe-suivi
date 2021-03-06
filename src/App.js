import { Button } from '@mui/material';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import './App.css';
import { TextInput } from './Input';
import { SelectInput } from './Select';

const verifiedNumberValue = (value) => {
  if (value && value !== undefined) {
    const matchLetter = value?.match(/[a-zA-Z]/);
    const matchSpecialCaracters = value?.match(/[^.\w]/);
    const matchDotWithoutNumber = value?.match(/(^\.|\.$)/);

    const matches = _.union(matchLetter, matchSpecialCaracters, matchDotWithoutNumber);
    if (matches && matches.length > 0) {
      return false;
    }
    return true;
  }
  return false;
};


function App() {

  const { handleSubmit, control, watch, setValue } = useForm()

  const [fileDownloadUrl, setFileDownloadUrl] = useState(null)
  const typeProductionEcs = watch('natureOfEcsProduction')
  const typeEnergie = watch('energyType')

  useEffect(() => {
    if (typeProductionEcs !== 'separate') {
      setValue('combustibleConsumptionEcs', undefined)
      setValue('currentEnergyTypeEcs', undefined)
    }
  }, [typeProductionEcs])

  const onSubmit = (values) => {
    let tmp = {}
    _.forOwn(values, (value, key) => {
      if (verifiedNumberValue(value)) {
        tmp = { ...tmp, [key]: parseFloat(value) }
      } else {
        tmp = { ...tmp, [key]: value }
      }
    })
    console.log(tmp)
    const blob = new Blob([JSON.stringify(tmp)]);
    setFileDownloadUrl(URL.createObjectURL(blob));
    this.dofileDownload.click()
  }

  return (
    <div className="App"
      style={{
        maxWidth: '700px',
        margin: "0 auto"
      }}
    >
      <h1>Formulaire de suivi RAFE</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section
          style={{
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <SelectInput
            name='natureOfEcsProduction'
            label='Nature de la production ECS'
            control={control}
            options={[
              { value: "shared", label: "Partag??e" },
              { value: "individual", label: "Individuelle" },
              { value: "separate", label: "S??par??e" },
            ]}
          />
          <TextInput
            setValue={setValue}
            type='number'
            name='year'
            label='Ann??e'
            control={control}
          />
          <TextInput
            setValue={setValue}
            type='number'
            name='generalCharges'
            label='Charges g??n??rales'
            control={control}
          />
          <SelectInput
            name='energyType'
            label='Energie'
            control={control}
            options={[
              { value: "naturalGas", label: "Gaz naturel" },
              { value: "oil", label: "Fioul" },
              { value: "rcu", label: "RCU" },
              { value: "propane", label: "Propane" },
              { value: "biopropane", label: "Bio propane" },
              { value: "greenGaz", label: "Gaz vert" },
              { value: "butane", label: "Butane" },
              { value: "granulatedWood", label: "Granul?? de bois" },
              { value: "granulatedWood", label: "Bois" },
              { value: "electricity", label: "Electricit??" },
              { value: "other", label: "Autre" },
            ]}
          />
          <TextInput
            setValue={setValue}
            type='number'
            name='combustibleConsumption'
            label={`consommation ${['granulatedWood', 'granulatedWood'].includes(typeEnergie) ?
              '(T)' : ['oil'].includes(typeEnergie) ? '(L)' : '(Kwh)'}`}
            control={control}
          />

          <TextInput
            setValue={setValue}
            type='number'
            name='combustibleCost'
            label='co??t p1 (???)'
            control={control}
          />
          <TextInput
            setValue={setValue}
            type='number'
            name='ecsCost'
            label='co??t ECS (???)'
            control={control}
          />
          {
            typeProductionEcs === "separate" ? (
              <>
                <TextInput
                  setValue={setValue}
                  type='number'
                  name='combustibleConsumptionEcs'
                  label='consommation ECS (kWh)'
                  control={control}
                />
                <SelectInput
                  name='currentEnergyTypeEcs'
                  label="Type d'??nergie ECS"
                  control={control}
                  options={[
                    { value: "naturalGas", label: "Gaz naturel" },
                    { value: "oil", label: "Fioul" },
                    { value: "rcu", label: "RCU" },
                    { value: "propane", label: "Propane" },
                    { value: "biopropane", label: "Bio propane" },
                    { value: "greenGaz", label: "Gaz vert" },
                    { value: "butane", label: "Butane" },
                    { value: "granulatedWood", label: "Granul?? de bois" },
                    { value: "woodChips", label: "Bois" },
                    { value: "electricity", label: "Electricit??" },
                    { value: "other", label: "Autre" },
                  ]}
                />
              </>
            ) : null
          }
          <TextInput
            setValue={setValue}
            type='number'
            name='ecsVolume'
            label='volume ECS (m3)'
            control={control}
          />
          <TextInput
            setValue={setValue}
            type='number'
            name='dju'
            label='DJU'
            control={control}
          />
          <TextInput
            setValue={setValue}
            type='number'
            name='investmentMade'
            label='Investissements effectu??s (???)'
            control={control}
          />
        </section>
        {
          fileDownloadUrl ? (
            <Button
              download={'rafe-suivi.json'}
              href={fileDownloadUrl}
            >
              Telecharger
            </Button>

          ) : null
        }
        <Button
          type="submit"
        >
          Valider
        </Button>
      </form>
    </div>
  );
}

export default App;
