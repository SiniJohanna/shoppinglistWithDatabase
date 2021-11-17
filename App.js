import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput, FlatList } from 'react-native';
import * as SQLite from 'expo-sqlite';

export default function App() {

  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const [shoppinglistItem, setShoppinglistItem] = useState([]);

  const db  = SQLite.openDatabase('shoppinglistdb.db');

  useEffect(()=> {
    db.transaction(tx => {
      tx.executeSql('create table if not exists shoppinglist (id  integer primary key not null, text text, amount int);');
    }, null, updateList);
  }, []);

  const updateList = () => {
    db.  transaction(tx => {
      tx.executeSql('select * from shoppinglist;', [], (_, { rows})   => 
      setShoppinglistItem(rows._array)); 
    });
  }

  const buttonPressed = () => {
    db.transaction(tx => {
      tx.executeSql('insert into shoppinglist(text,amount)values(?,?);',
        [text, parseInt(amount)]);
      }, null, updateList
    )
    setText('');
    setAmount('');
  }

  const deleteItem = (id) => {
    db.transaction(tx =>  {
        tx.executeSql(`delete from shoppinglist where id = ?;`, [ id]);}, null, updateList) }


  return (
    <View style={styles.container}>
      <TextInput style={styles.input} onChangeText={text => setText(text)} value={text} />
      <TextInput style={styles.input} keyboardType="numeric" onChangeText={amount => setAmount(amount)} value={amount} />
      
      <Button onPress={buttonPressed} title="Save" />
      
      <FlatList 
        ListHeaderComponent= {<Text style={styles.listHeader}>Shopping list</Text>}
        keyExtractor={item=> item.id.toString()}
        data={shoppinglistItem}
        renderItem={({ item }) =>
          <View style={styles.listItemContainer}>
            <Text>{item.text},{item.amount}</Text>
            <Text style={{color: '#0000ff'}} onPress={()  =>  deleteItem(item.id)  }>bought</Text>
          </View>
        }
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  input: {
    
    marginBottom: 5,
    width: 200,
    borderColor: 'gray',
    borderWidth: 1 
  },
  listHeader: {
    color:'blue',
    fontWeight: 'bold',
    alignItems:'center'
  },
  listItemContainer: {
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems:'baseline'
  }
});