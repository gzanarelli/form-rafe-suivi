import { Button, Grid } from '@mui/material';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import './App.css';
import { TextInput } from './Input';
import { SelectInput } from './Select';
import axios from './axios'
import { ActionList } from './ActionList'

// Check Value if a number && parse the value
const verifiedNumberValue = (value) => {
  if (_.isArray(value)) {
    return false
  }
  if (value && value !== undefined && typeof value === 'string') {
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

const optionsNatureOfEcs = [
  { value: "shared", label: "Partagée" },
  { value: "individual", label: "Individuelle" },
  { value: "separate", label: "Séparée" },
]

function App() {

  const { handleSubmit, control, watch, setValue, reset, register } = useForm({
    defaultValues: {
      reportId: '',
      combustibleConsumption: '',
      combustibleConsumptionEcs: '',
      combustibleCost: '',
      currentEnergyTypeEcs: '',
      dju: '',
      ecsCost: '',
      ecsVolume: '',
      energyType: '',
      generalCharges: '',
      investmentMade: '',
      natureOfEcsProduction: '',
      year: '',
      actions: []
    }
  })

  const [fileDownloadUrl, setFileDownloadUrl] = useState(null)
  const [reportList, setReportList] = useState([])
  const [reportSelected, setReportSelected] = useState('')
  const [inventorySelected, setInventorySelected] = useState('')
  const [actionList, setActionList] = useState([])
  const [optionsBuildingListName, setOptionsBuildingListName] = useState([])
  const typeProductionEcs = watch('natureOfEcsProduction')
  const typeEnergie = watch('energyType')
  const buildingSelect = watch('reportId')

  // Fetch Inventories List
  useEffect(() => {
    const fetchDatas = async (page, dataFetch, reportListTpm) => {
      let result = await axios.get(`reports?limit=100&page=${page}`)
      dataFetch = [...dataFetch, ...result.data.data.map(value => { return { label: value.name ?? '', value: value._id ?? '' } })]
      reportListTpm = [...reportListTpm, ...result.data.data]
      if (result.data.page < result.data.pages) {
        fetchDatas(result.data.page + 1, dataFetch, reportListTpm)
      } else {
        setOptionsBuildingListName(dataFetch)
        setReportList(reportListTpm)
      }
    }
    fetchDatas(1, [], [])
  }, [])

  // Set action list if we have a report selected
  useEffect(() => {
    if (buildingSelect) {
      const reportSelectedTmp = reportList.find(report => report._id === buildingSelect)
      setReportSelected(reportSelectedTmp)
      setActionList(reportSelectedTmp?.actions)
      setValue('actions', reportSelectedTmp?.actions)
    }
  }, [buildingSelect, reportList])

  // Get Inventory for natureOfEcs and energies
  useEffect(() => {
    const fetchDatas = async () => {
      const buildingDoc = await axios.get(`buildings/${reportSelected.building}`)
      const inventoryDoc = await axios.get(`inventories?targetBoiler=${buildingDoc.data.data.linkedBoiler}`)
      setInventorySelected(inventoryDoc.data.data[0])
    }

    fetchDatas()
  }, [reportSelected])

  // Reinit Values if the condition is not validate
  useEffect(() => {
    if (typeProductionEcs !== 'separate') {
      setValue('combustibleConsumptionEcs', undefined)
      setValue('currentEnergyTypeEcs', undefined)
    }
  }, [typeProductionEcs])

  const onReset = () => {
    reset()
    setFileDownloadUrl(null)
  }

  const onSubmit = async (values) => {
    console.log(values)
    setFileDownloadUrl(null)
    let tmp = {}
    _.forOwn(values, async (value, key) => {
      if (_.isArray(value)) {
        tmp = { ...tmp, [key]: value }
      } else if (Object.keys(value).length > 0) {
        tmp = { ...tmp, [key]: value }
      } else if (verifiedNumberValue(value)) {
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

  if (optionsBuildingListName.length === 0) {
    return 'Loading datas...'
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
          <Grid container spacing={1}>
            <Grid item sm={12} spacing={1}>
              <SelectInput
                name='reportId'
                label='Nom du bâtiment'
                control={control}
                setValue={setValue}
                options={optionsBuildingListName}
              />
            </Grid>
          </Grid>
          {buildingSelect && inventorySelected ? (
            <>
              <Grid item sm={6} spacing={1}>
                <SelectInput
                  name='natureOfEcsProduction'
                  label='Nature de la production ECS'
                  control={control}
                  setValue={setValue}
                  options={optionsNatureOfEcs}
                />
              </Grid>
              <TextInput
                name='year'
                setValue={setValue}
                type='number'
                label='Année'
                control={control}
              />
              <TextInput
                name='generalCharges'
                setValue={setValue}
                type='number'
                label='Charges générales'
                control={control}
              />
              <SelectInput
                name='energyType'
                label='Energie'
                control={control}
                setValue={setValue}
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
                name='combustibleConsumption'
                setValue={setValue}
                type='number'
                label={`consommation ${['granulatedWood', 'granulatedWood'].includes(typeEnergie) ?
                  '(T)' : ['oil'].includes(typeEnergie) ? '(L)' : '(Kwh)'}`}
                control={control}
              />

              <TextInput
                name='combustibleCost'
                setValue={setValue}
                type='number'
                label='coût p1 (€)'
                control={control}
              />
              <TextInput
                name='ecsCost'
                setValue={setValue}
                type='number'
                label='coût ECS (€)'
                control={control}
              />
              {
                typeProductionEcs === "separate" ? (
                  <>
                    <TextInput
                      name='combustibleConsumptionEcs'
                      setValue={setValue}
                      type='number'
                      label='consommation ECS (kWh)'
                      control={control}
                    />
                    <SelectInput
                      name='currentEnergyTypeEcs'
                      label="Type d'énergie ECS"
                      control={control}
                      setValue={setValue}
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
                name='ecsVolume'
                setValue={setValue}
                type='number'
                label='volume ECS (m3)'
                control={control}
              />
              <TextInput
                name='dju'
                setValue={setValue}
                type='number'
                label='DJU'
                control={control}
              />
              <TextInput
                name='investmentMade'
                setValue={setValue}
                type='number'
                label='Investissements effectués (€)'
                control={control}
              />
              {
                actionList.length > 0 ? (
                  <ActionList
                    actionList={actionList}
                    control={control}
                    register={register}
                    setValue={setValue}
                  />
                ) : null
              }
            </>
          ) : null}
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
        <Button
          type="button"
          onClick={onReset}
        >
          Reset
        </Button>
      </form>
    </div>
  );
}

export default App;
