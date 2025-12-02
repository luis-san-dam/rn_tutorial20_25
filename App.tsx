import { Alert, FlatList, Modal, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Actor, ActorCompleto, Actores, DatosFormulario } from './model/Tipos'
import { borrarActor, completarActor, consultarActores, crearActor, modificarActor } from './helpers/CrudActores'
import VisorActor from './components/VisorActor'
import { SafeAreaView } from 'react-native-safe-area-context'
import Toolbar from './components/Toolbar'
import EditorActor from './components/EditorActor'

export default function App() {

  const [listaActores, setListaActores] = useState<Actores>([])
  const [actorSeleccionado, setActorSeleccionado] = useState<ActorCompleto|undefined>(undefined)
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  useEffect(inicializarListaActores, [])

  function mostrarError(mensaje:string){
    Alert.alert("Error",mensaje)
  }

  function inicializarListaActores(){
    consultarActores()
      .then( lista => setListaActores(lista))
      .catch( error => mostrarError(error.toString()) )
  }

  function seleccionarActor(actor:Actor){
    completarActor(actor)
    .then( actorCompleto => {setActorSeleccionado(actorCompleto)
                            setModalVisible(true)})
    .catch( error => mostrarError(error.toString()))
  }

  function getEtiquetaActor(actor:Actor) {
    return <VisorActor actor={actor} seleccionarActor={ seleccionarActor }/>
  }

  function abrirFormularioNuevoActor(){

  }

  function accionCrearActor(datos:DatosFormulario){
      crearActor(datos)
        .then( nuevoActor => {
          const nuevaLista = [nuevoActor,...listaActores]
          setListaActores(nuevaLista)
          setModalVisible(false)
        })
        .catch( error => mostrarError(error.toString()))
  }

  function accionModificarActor(idActor:string, datos:DatosFormulario){
      modificarActor(idActor, datos)
        .then( actorModificado => {
          const nuevaLista = listaActores.map(
            actor => actor.id === actorModificado.id? actorModificado : actor
          )
          setListaActores(nuevaLista)
          setModalVisible(false)
        })
        .catch( error => mostrarError(error.toString()))
  }

  function accionBorrarActor(){
      if(actorSeleccionado!==undefined){
        Alert.alert (
          `¿Deseas borrar a ${actorSeleccionado.nombre}?`,
          "Un actor eliminado no podrá ser recuperado",
          [
            {text:"Sí, eliminar", onPress: () => realizarBorrado(actorSeleccionado.id)},
            {text:"No, cancelar"}
          ]
        )
      }
  }

  function realizarBorrado(idActor:string){
    borrarActor(idActor)
      .then( idBorrado => {
        const nuevaLista = listaActores.filter( actor => actor.id !== idBorrado)
        setListaActores(nuevaLista)
        setModalVisible(false)
      })
      .catch( error => mostrarError(error.toString()))
  }

  return (
    <SafeAreaView style={styles.contenedor}>
      <Toolbar abrirFormularioNuevoActor={ abrirFormularioNuevoActor } />
      <FlatList 
        data={ listaActores }
        keyExtractor={ actor => actor.id}
        renderItem={ ({item}) => getEtiquetaActor(item)}
        numColumns={3}
      />
      {
        modalVisible && (
          <Modal animationType={"slide"} transparent={true}>
            <EditorActor 
              actorSeleccionado={actorSeleccionado}
              setModalVisible={setModalVisible}
              accionCrearActor={accionCrearActor}
              accionModificarActor={accionModificarActor}
              accionBorrarActor={accionBorrarActor}
            />
          </Modal>
        )
      }
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  contenedor: {

  }
})