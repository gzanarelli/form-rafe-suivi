import { Button } from '@mui/material';
import _ from 'lodash';
import { useState } from 'react';
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
              { value: "shared", label: "Partagée" },
              { value: "individual", label: "Individuelle" },
              { value: "separate", label: "Séparée" },
            ]}
          />
          <TextInput
            setValue={setValue}
            type='number'
            name='year'
            label='Année'
            control={control}
          />
          <TextInput
            setValue={setValue}
            type='number'
            name='generalCharges'
            label='Charges générales'
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
              { value: "granulatedWood", label: "Granulé de bois" },
              { value: "granulatedWood", label: "Bois" },
              { value: "electricity", label: "Electricité" },
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
            label='coût p1 (€)'
            control={control}
          />
          <TextInput
            setValue={setValue}
            type='number'
            name='ecsCost'
            label='coût ECS (€)'
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
                  label="Type d'énergie ECS"
                  control={control}
                  options={[
                    { value: "naturalGas", label: "Gaz naturel" },
                    { value: "oil", label: "Fioul" },
                    { value: "rcu", label: "RCU" },
                    { value: "propane", label: "Propane" },
                    { value: "biopropane", label: "Bio propane" },
                    { value: "greenGaz", label: "Gaz vert" },
                    { value: "butane", label: "Butane" },
                    { value: "granulatedWood", label: "Granulé de bois" },
                    { value: "woodChips", label: "Bois" },
                    { value: "electricity", label: "Electricité" },
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
            label='Investissements effectués (€)'
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
