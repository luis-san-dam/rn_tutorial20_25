import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { Pelicula } from '../model/Tipos'
import DialogContainer from 'react-native-dialog/lib/Container'

type DialogoNuevaPeliculaProps = {
    dialogoVisible: boolean
    setDialogoVisible: React.Dispatch<React.SetStateAction<boolean>>
    nuevaPelicula: (pelicula:Pelicula) => void
}

export default function DialogoNuevaPelicula(
    {dialogoVisible, setDialogoVisible, nuevaPelicula}:DialogoNuevaPeliculaProps ) {

        const [titulo, setTitulo] = useState("")

        function cerrarDialogo(){
            setDialogoVisible(false)
        }

  return (
    <DialogContainer
        visible={ dialogoVisible }
        onBackdropPress={ cerrarDialogo }
        onRequestClose={ cerrarDialogo }
    >
        <Dialog.Title>Nueva Película</Dialog.Title>
        <Dialog.Description>La película se añadirá al actor</Dialog.Description>
        <Dialog.Input label={"Título de la película"} value={titulo} onChangeText={setTitulo}/>
        <Dialog.Button label={"cancelar"} onPress={cerrarDialogo}/>
        <Dialog.Button label={"aceptar"} onPress={() => nuevaPelicula(titulo)}/>
    </DialogContainer>
  )
}

const styles = StyleSheet.create({})