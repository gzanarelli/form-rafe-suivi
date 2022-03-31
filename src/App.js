import { useForm } from 'react-hook-form';
import './App.css';
import { TextInput } from './Input';
import { SelectInput } from './Select';

function App() {

  const {handleSubmit, register, control, watch} = useForm()
  const onSubmit = (values) => console.log(values)

  const typeProductionEcs = watch('natureOfEcsProduction')

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
              {value: "shared", label: "Partagée"},
              {value: "individual", label: "Individuelle"},
              {value: "separate", label: "Séparée"},
            ]}
          />
          <TextInput
            name='year'
            label='Année'
            control={control}
          />
          <TextInput
            name='generalCharges'
            label='Charges générales'
            control={control}
          />
          <SelectInput
            name='energyType'
            label='Energie'
            control={control}
            options={[
              {value: "naturalGas", label: "Gaz naturel"},
              {value: "oil", label: "Fioul"},
              {value: "rcu", label: "RCU"},
              {value: "propane", label: "Propane"},
              {value: "biopropane", label: "Bio propane"},
              {value: "greenGaz", label: "Gaz vert"},
              {value: "butane", label: "Butane"},
              {value: "granulatedWood", label: "Granulé de bois"},
              {value: "woodChips", label: "Bois"},
              {value: "electricity", label: "Electricité"},
              {value: "other", label: "Autre"},
            ]}
          />
          <TextInput
            name='combustibleConsumption'
            label='consommation'
            control={control}
          />

          <TextInput
            name='combustibleCost'
            label='coût p1 (€)'
            control={control}
          />
          <TextInput
            name='ecsCost'
            label='coût ECS (€)'
            control={control}
          />
          {
            typeProductionEcs === "separate" ? (
              <>
                <TextInput
                  name='combustibleConsumptionEcs'
                  label='consommation ECS (kWh)'
                  control={control}
                />
                <SelectInput
                  name='currentEnergyTypeEcs'
                  label="Type d'énergie ECS"
                  control={control}
                  options={[
                    {value: "naturalGas", label: "Gaz naturel"},
                    {value: "oil", label: "Fioul"},
                    {value: "rcu", label: "RCU"},
                    {value: "propane", label: "Propane"},
                    {value: "biopropane", label: "Bio propane"},
                    {value: "greenGaz", label: "Gaz vert"},
                    {value: "butane", label: "Butane"},
                    {value: "granulatedWood", label: "Granulé de bois"},
                    {value: "woodChips", label: "Bois"},
                    {value: "electricity", label: "Electricité"},
                    {value: "other", label: "Autre"},
                  ]}
                />
              </>
            ) : null
          }
          <TextInput
            name='ecsVolume'
            label='volume ECS (m3)'
            control={control}
          />
          <TextInput
            name='dju'
            label='DJU'
            control={control}
          />
          <TextInput
            name='investmentMade'
            label='Investissements effectués (€)'
            control={control}
          />
        </section>
        <button type="submit">Valider</button>
      </form>
    </div>
  );
}

export default App;
