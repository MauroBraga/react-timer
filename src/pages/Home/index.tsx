import { Play,HandPalm } from "phosphor-react";
import { HomeContainer,StartCountdownButton,StopCountdownButton } from "./styles";
import { createContext, useEffect, useState } from 'react'
import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod'
import { FormProvider, useForm } from "react-hook-form";
// controlled / uncontrolled

interface Cycle{
    id: string;
    task: string;
    minutesAmount: number;
    startDate: Date;
    interruptedDate?: Date;
    finishedDate?: Date
}

interface CycleContextType {
  activeCycle: Cycle | undefined;  
  activeCycleId: string | null;
  markCurrentCycleAsFinished: () => void;
  amountSecondsPassed: number;
  setSecondsPassed: (seconds: number) => void;
}

export const CyclesContext = createContext({} as CycleContextType)

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod
    .number()
    .min(5, 'O ciclo precisa ser de no mínimo 5 minutos.')
    .max(60, 'O ciclo precisa ser de no máximo 60 minutos.'),
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function Home(){

  const newCicleForm = useForm<NewCycleFormData>({ 
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  const {handleSubmit,watch,reset} = newCicleForm;

  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);
  
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  function setSecondsPassed(seconds:number){
    setAmountSecondsPassed(seconds)
  }

  function markCurrentCycleAsFinished(){
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, finishedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )
  }

   function handleCreateNewCycle(data: NewCycleFormData) {
        const id = String(new Date().getTime())
        const newCycle:Cycle= {
            id,
            task:data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        }
        setCycles((state) => [...state, newCycle])
        setActiveCycleId(id)
       setAmountSecondsPassed(0)
        reset();
    } 

    function handleInterruptCycle() {
      setCycles(
        cycles.map((cycle) => {
          if (cycle.id === activeCycleId) {
            return { ...cycle, interruptedDate: new Date() }
          } else {
            return cycle
          }
        }),
      )
      setActiveCycleId(null)
    }
  
    

   const task = watch('task')
   const isSubmitDisable = !task

    return(
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)}>
               
                <CyclesContext.Provider  value={{activeCycle,activeCycleId,markCurrentCycleAsFinished,amountSecondsPassed,setSecondsPassed}}>
                  <FormProvider {...newCicleForm}>
                    <NewCycleForm />

                  </FormProvider>
                  <Countdown />
                </CyclesContext.Provider>
                
          

                  {activeCycle ? (
                    <StopCountdownButton onClick={handleInterruptCycle} type="button">
                      <HandPalm size={24} />
                      Interromper
                    </StopCountdownButton>
                  ) : (
                    <StartCountdownButton /*disabled={isSubmitDisable} */ type="submit">
                      <Play size={24} />
                      Começar
                    </StartCountdownButton>
                  )}
            </form>
        </HomeContainer>
    )
}