import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';

const BUTTONS = [
  ['C', '(', ')', '÷'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '−'],
  ['1', '2', '3', '+'],
  ['0', '.', '⌫', '='],
];

type ButtonType = 'operator' | 'function' | 'equal' | 'clear' | 'number';

function getButtonType(btn: string): ButtonType {
  if (btn === '=') return 'equal';
  if (btn === 'C') return 'clear';
  if (['÷', '×', '−', '+'].includes(btn)) return 'operator';
  if (['(', ')', '⌫'].includes(btn)) return 'function';
  return 'number';
}

export default function Calculator() {
  const [expression, setExpression] = useState('');
  const [justCalculated, setJustCalculated] = useState(false);

  const handlePress = (btn: string) => {
    if (btn === 'C') {
      setExpression(''); setJustCalculated(false); return;
    }
    if (btn === '⌫') {
      if (justCalculated) { setExpression(''); setJustCalculated(false); return; }
      setExpression(expression.length > 1 ? expression.slice(0, -1) : ''); return;
    }
    if (btn === '=') {
      try {
        const js = expression.replace(/÷/g,'/').replace(/×/g,'*').replace(/−/g,'-');
        const result = eval(js);
        if (!isFinite(result)) {
          setExpression('Erreur'); setJustCalculated(true); return;
        }
        setExpression(String(parseFloat(result.toFixed(10)))); setJustCalculated(true);
      } catch { setExpression('Erreur'); setJustCalculated(true); }
      return;
    }
    if (justCalculated) {
      // Après un résultat, si on tape un opérateur on continue, sinon on repart
      if (['÷', '×', '−', '+'].includes(btn)) {
        setExpression(expression + btn); setJustCalculated(false);
      } else {
        setExpression(btn); setJustCalculated(false);
      }
      return;
    }
    if (btn === '.') {
      // Trouver le dernier nombre pour vérifier s'il a déjà un point
      const parts = expression.split(/[+\-×÷()]/);
      const lastPart = parts[parts.length - 1];
      if (!lastPart.includes('.')) setExpression(expression + '.');
      return;
    }
    setExpression(expression + btn);
  };

  const formatDisplay = (val: string) => {
    if (val.length > 14) {
      const num = parseFloat(val);
      if (!isNaN(num)) return num.toExponential(4);
    }
    return val || '0';
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.phone}>
        <View style={styles.screen}>
          <Text style={styles.display} numberOfLines={2} adjustsFontSizeToFit>
            {formatDisplay(expression)}
          </Text>
        </View>
        <View style={styles.buttons}>
          {BUTTONS.map((row, i) => (
            <View key={i} style={styles.row}>
              {row.map((btn) => {
                const type = getButtonType(btn);
                return (
                  <TouchableOpacity
                    key={btn}
                    style={[styles.btn, styles[type]]}
                    onPress={() => handlePress(btn)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.btnText, type === 'number' || type === 'function' ? styles.darkText : styles.lightText]}>
                      {btn}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0f0f1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  phone: {
    width: 360,
    backgroundColor: '#1a1a2e',
    borderRadius: 48,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  screen: {
    backgroundColor: '#16213e',
    paddingHorizontal: 28,
    paddingTop: 40,
    paddingBottom: 28,
    minHeight: 170,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  display: {
    fontSize: 52,
    fontWeight: '300',
    color: '#ffffff',
    maxWidth: '100%',
    letterSpacing: 1,
    textAlign: 'right',
  },
  buttons: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    paddingTop: 20,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 14,
    gap: 10,
  },
  btn: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  btnText: {
    fontSize: 26,
    fontWeight: '600',
  },
  darkText: { color: '#1a1a2e' },
  lightText: { color: '#ffffff' },
  number: { backgroundColor: '#e2e8f0' },
  function: { backgroundColor: '#2d3a55' },
  operator: { backgroundColor: '#f97316' },
  equal: { backgroundColor: '#2563eb' },
  clear: { backgroundColor: '#ef4444' },
});