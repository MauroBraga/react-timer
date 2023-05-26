import { Play,HandPalm } from "phosphor-react";
import { HomeContainer,StartCountdownButton,StopCountdownButton } from "./styles";
import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod'
import { FormProvider, useForm } from "react-hook-form";
import { CyclesContext } from "../../context/CyclesContext";
import { useContext } from "react";
// controlled / uncontrolled


const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod
    .number()
    .min(5, 'O ciclo precisa ser de no mínimo 5 minutos.')
    .max(60, 'O ciclo precisa ser de no máximo 60 minutos.'),
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function Home(){

  const { activeCycle, createNewCycle, interruptCurrentCycle } =
    useContext(CyclesContext)

  const newCicleForm = useForm<NewCycleFormData>({ 
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  const {handleSubmit,watch,reset} = newCicleForm;
  const task = watch('task')
  const isSubmitDisable = !task

    return(
      <HomeContainer>
        <form onSubmit={handleSubmit(createNewCycle)}>
               
            <FormProvider {...newCicleForm}>
              <NewCycleForm />
              </FormProvider>
              <Countdown />
            
      

              {activeCycle ? (
                <StopCountdownButton onClick={interruptCurrentCycle} type="button">
                  <HandPalm size={24} />
                  Interromper
                </StopCountdownButton>
              ) : (
                <StartCountdownButton disabled={isSubmitDisable} type="submit">
                  <Play size={24} />
                  Começar
                </StartCountdownButton>
              )}
          </form>
      </HomeContainer>
    )
}