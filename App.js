import React, { Component } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Button,
  Modal,
} from "react-native";
const axios = require("axios");
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: 50.33021040452407,
      longitude: 19.562556559099693,
      error: null,
      speed: null,
      timestamp: null,
      Data: [],
      text: "",
      s: 0,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
      idName: "",
      watchId: null,
      badgeMyIndex: 0,
      modalVisible: true,
    };
  }
  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = JSON.stringify(position);
        const latitude = JSON.stringify(position.coords.latitude);
        const longitude = JSON.stringify(position.coords.longitude);
        const speed = JSON.stringify(position.coords.speed);

        this.setState({ location });
        this.setState({ latitude });
        this.setState({ longitude });
        this.setState({ speed });
        this.setState({ timestamp: position.timestamp });

        this.setState({ badgeMyIndex: this.state.badgeMyIndex + 1 });
        console.log(`this.state.badgeMyIndex ${this.state.badgeMyIndex}`);

        this.state.Data.push({
          id: Math.random().toString(12).substring(0),
          text: new Date(position.timestamp).toString(),
          color: "red",
          text2: position.coords.longitude,
          text3: position.coords.latitude,
        });
      },
      (error) => console.log(error),
      { enableHighAccuracy: true, timeout: 50000, maximumAge: 1000 }
    );

    let watchId = navigator.geolocation.watchPosition(
      (position) => {
        var d = new Date(position.timestamp);
        var n = d.toString();
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          timestamp: n,
        });
        console.log(
          "timestamp: " +
            n +
            " latitude: " +
            position.coords.latitude +
            " longitude: " +
            position.coords.longitude
        );

        this.setState({ badgeMyIndex: this.state.badgeMyIndex + 1 });
        this.state.Data.push({
          id: Math.random().toString(12).substring(0),
          text: new Date(position.timestamp).toString(),
          color: "red",
          text2: position.coords.longitude,
          text3: position.coords.latitude,
        });

        axios
          .get(
            `https://busmapa.ct8.pl/saveToDB.php?time=` +
              this.state.timestamp +
              `&lat=` +
              this.state.latitude +
              `&longitude=` +
              this.state.longitude +
              `&s=0` +
              `&idName=` +
              this.state.idName
          )
          .then((result) => {
            console.log("axios success " + result.data + " timestamp: " + n);
          })
          .catch((err) => {
            console.log("axios failed " + err);
          });
      },
      (error) => this.setState({ error: error.message }),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
        distanceFilter: 100,
      }
    );
    console.log("this.watchId: " + watchId);
  }
  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }
  findCoordinates = () => {
    console.log("click  odczyt");
    navigator.geolocation.getCurrentPosition((position) => {
      const latitude = JSON.stringify(position.coords.latitude);
      const longitude = JSON.stringify(position.coords.longitude);
      const speed = JSON.stringify(position.coords.speed);

      this.setState({ latitude, longitude, speed });
      this.setState({ timestamp: new Date(position.timestamp).toString() });
      this.setState({ badgeMyIndex: this.state.badgeMyIndex + 1 });

      this.state.Data.push({
        id: Math.random().toString(12).substring(0),
        text: new Date(position.timestamp).toString(),
        color: "red",
        text2: latitude,
        text3: longitude,
      });

      console.log(`latitude ${latitude} longitude ${longitude}`);
      axios
        .get(
          `https://busmapa.ct8.pl/saveToDB.php?time=` +
            new Date(position.timestamp).toString() +
            `&lat=` +
            latitude +
            `&longitude=` +
            longitude +
            `&s=` +
            speed +
            `&idName=` +
            this.state.idName
        )
        .then((result) => {
          console.log(
            "axios success " +
              result.data +
              " timestamp: " +
              new Date(position.timestamp).toString()
          );
        })
        .catch((err) => {
          console.log("axios failed " + err);
        });
    });
  };
  renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.textStyle3}>{item.text}</Text>
      <Text style={styles.textStyle3}>{item.text2}</Text>
      <Text style={styles.textStyle3}>{item.text3}</Text>
    </View>
  );
  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };
  render() {
    const { modalVisible } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ padding: 10, fontSize: 20 }}>
                    Identyfikator trasy:{" "}
                  </Text>
                  <TextInput
                    style={{ padding: 10, fontSize: 20 }}
                    editable={true}
                    selectionColor={"blue"}
                    underlineColorAndroid={"gray"}
                    placeholder="Wprowadź identyfikator"
                    onSubmitEditing={(event) => {
                      this.setState({ idName: event.nativeEvent.text });
                      console.log(`idName: ${event.nativeEvent.text}`);
                    }}
                  ></TextInput>
                </View>

                <TouchableHighlight
                  style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                  onPress={() => {
                    this.setModalVisible(!modalVisible);
                  }}
                >
                  <Text style={styles.textStyle}>OK</Text>
                </TouchableHighlight>
              </View>
            </View>
          </Modal>
          <TouchableHighlight
            style={styles.openButton}
            onPress={() => {
              this.setModalVisible(true);
            }}
          >
            <Text style={styles.textStyle}>Identyfikator trasy</Text>
          </TouchableHighlight>

          <TouchableOpacity
            style={styles.header1}
            onPress={this.findCoordinates}
          >
            <View style={styles.textStyle2}>
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                Odczyt GPS
              </Text>
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                }}
              >
                Identyfikator:{" "}
                <Text
                  style={{
                    color: "red",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  {" "}
                  {this.state.idName}{" "}
                </Text>
              </Text>
              <Text>Latitude: {this.state.latitude}</Text>
              <Text>Longitude: {this.state.longitude}</Text>
              <Text>timestamp: {this.state.timestamp}</Text>
              {this.state.error ? <Text>Error: {this.state.error}</Text> : null}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.textStyle2}
            onPress={() => {
              this.setState({ Data: [] });
              this.setState({ badgeMyIndex: 0 });
            }}
          >
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontWeight: "bold",
                margin: 10,
              }}
            >
              Tabela pozycji GPS ({this.state.badgeMyIndex})
            </Text>
          </TouchableOpacity>

          <FlatList
            style={styles.mytabela}
            data={this.state.Data.reverse()}
            keyExtractor={(item) => item.id.toString()}
            renderItem={this.renderItem}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    fontSize: 20,
    width: "100%",
    borderColor: "red",
    marginTop: 30,
  },
  header2: {
    backgroundColor: "#7777",
    textAlign: "center",
    alignItems: "center",
    borderRadius: 110,
    width: "95%",
    paddingTop: 25,
    paddingBottom: 15,
    fontSize: 20,
    borderColor: "red",
    margin: 10,
  },
  mytabela: {
    maxWidth: "100%",
    borderRadius: 30,
    width: 350,
    paddingTop: 10,
    paddingBottom: 5,
    fontSize: 20,
  },
  header1: {
    backgroundColor: "#2196F3",
    maxWidth: "100%",
    textAlign: "center",
    alignItems: "center",
    borderRadius: 30,
    width: "95%",
    paddingTop: 10,
    paddingBottom: 25,
    fontSize: 20,
    margin: 10,
    color: "white",
  },
  textStyle3: {
    marginVertical: 4,
    fontSize: 10,
    marginLeft: 10,
    color: "white",
  },
  item: {
    backgroundColor: "#2196F3",
    padding: 10,
    marginVertical: 5,
    height: 90,
    borderRadius: 30,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  modalView: {
    margin: 2,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    height: 600,
  },
  openButton: {
    backgroundColor: "#2196F3",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    width: 350,
  },
  modalText: {
    marginBottom: 5,
    textAlign: "center",
  },

  textStyle2: {
    color: "white",
    backgroundColor: "#2196F3",
    width: 380,
    fontWeight: "bold",
    textAlign: "center",
    borderRadius: 30,
    padding: 10,
  },
});
