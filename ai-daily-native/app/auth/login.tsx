import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { SymbolView } from 'expo-symbols';
import { ChevronLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { supabase } from '@/src/lib/supabase';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Fout', 'Vul je e-mailadres en wachtwoord in');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        Alert.alert('Inloggen mislukt', error.message);
      } else {
        router.back();
      }
    } catch (error) {
      Alert.alert('Fout', 'Er ging iets mis. Probeer het later opnieuw.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Fout', 'Vul je e-mailadres en wachtwoord in');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Fout', 'Wachtwoord moet minimaal 6 tekens bevatten');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        Alert.alert('Registratie mislukt', error.message);
      } else {
        Alert.alert(
          'Bevestig je e-mail',
          'We hebben een bevestigingslink naar je e-mailadres gestuurd.',
          [{ text: 'OK', onPress: () => setMode('login') }]
        );
      }
    } catch (error) {
      Alert.alert('Fout', 'Er ging iets mis. Probeer het later opnieuw.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Fout', 'Vul je e-mailadres in');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim());

      if (error) {
        Alert.alert('Fout', error.message);
      } else {
        Alert.alert(
          'E-mail verzonden',
          'Check je inbox voor de reset link.',
          [{ text: 'OK', onPress: () => setMode('login') }]
        );
      }
    } catch (error) {
      Alert.alert('Fout', 'Er ging iets mis. Probeer het later opnieuw.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (mode === 'login') handleSignIn();
    else if (mode === 'register') handleSignUp();
    else handleForgotPassword();
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: true,
          headerBlurEffect: 'systemMaterial',
          headerTitle: '',
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <BlurView intensity={80} tint="systemChromeMaterialLight" style={styles.backButtonGlass}>
                {Platform.OS === 'ios' ? (
                  <SymbolView
                    name="chevron.left"
                    style={styles.sfSymbol}
                    type="hierarchical"
                    tintColor="#1a1a1a"
                  />
                ) : (
                  <ChevronLeft size={20} color="#1a1a1a" strokeWidth={2.5} />
                )}
              </BlurView>
            </TouchableOpacity>
          ),
        }}
      />

      {/* Full-screen Liquid Glass background */}
      <BlurView intensity={80} tint="systemChromeMaterialLight" style={StyleSheet.absoluteFill} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={[styles.content, { paddingTop: insets.top + 80 }]}>
          {/* Logo / Brand */}
          <View style={styles.brandContainer}>
            <Text style={styles.brandTitle}>AI Dagelijks</Text>
            <Text style={styles.brandSubtitle}>
              {mode === 'login' && 'Log in op je account'}
              {mode === 'register' && 'Maak een nieuw account'}
              {mode === 'forgot' && 'Wachtwoord vergeten'}
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Email Input */}
            <View style={styles.inputWrapper}>
              <BlurView intensity={60} tint="systemChromeMaterialLight" style={styles.inputGlass}>
                <View style={styles.inputIcon}>
                  {Platform.OS === 'ios' ? (
                    <SymbolView
                      name="envelope"
                      style={styles.inputSfSymbol}
                      type="hierarchical"
                      tintColor="#71717a"
                    />
                  ) : (
                    <Mail size={20} color="#71717a" strokeWidth={2} />
                  )}
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="E-mailadres"
                  placeholderTextColor="#71717a"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  textContentType="emailAddress"
                />
              </BlurView>
            </View>

            {/* Password Input (not shown in forgot mode) */}
            {mode !== 'forgot' && (
              <View style={styles.inputWrapper}>
                <BlurView intensity={60} tint="systemChromeMaterialLight" style={styles.inputGlass}>
                  <View style={styles.inputIcon}>
                    {Platform.OS === 'ios' ? (
                      <SymbolView
                        name="lock"
                        style={styles.inputSfSymbol}
                        type="hierarchical"
                        tintColor="#71717a"
                      />
                    ) : (
                      <Lock size={20} color="#71717a" strokeWidth={2} />
                    )}
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Wachtwoord"
                    placeholderTextColor="#71717a"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoComplete="password"
                    textContentType={mode === 'register' ? 'newPassword' : 'password'}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                  >
                    {showPassword ? (
                      <EyeOff size={20} color="#71717a" strokeWidth={2} />
                    ) : (
                      <Eye size={20} color="#71717a" strokeWidth={2} />
                    )}
                  </TouchableOpacity>
                </BlurView>
              </View>
            )}

            {/* Forgot Password Link */}
            {mode === 'login' && (
              <TouchableOpacity onPress={() => setMode('forgot')} style={styles.forgotButton}>
                <Text style={styles.forgotText}>Wachtwoord vergeten?</Text>
              </TouchableOpacity>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading}
              style={styles.submitButtonContainer}
              activeOpacity={0.8}
            >
              <BlurView intensity={90} tint="systemChromeMaterialDark" style={styles.submitButton}>
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.submitText}>
                    {mode === 'login' && 'Inloggen'}
                    {mode === 'register' && 'Account aanmaken'}
                    {mode === 'forgot' && 'Reset link versturen'}
                  </Text>
                )}
              </BlurView>
            </TouchableOpacity>
          </View>

          {/* Mode Toggle */}
          <View style={styles.toggleContainer}>
            {mode === 'login' && (
              <TouchableOpacity onPress={() => setMode('register')}>
                <Text style={styles.toggleText}>
                  Nog geen account? <Text style={styles.toggleLink}>Registreren</Text>
                </Text>
              </TouchableOpacity>
            )}
            {mode === 'register' && (
              <TouchableOpacity onPress={() => setMode('login')}>
                <Text style={styles.toggleText}>
                  Heb je al een account? <Text style={styles.toggleLink}>Inloggen</Text>
                </Text>
              </TouchableOpacity>
            )}
            {mode === 'forgot' && (
              <TouchableOpacity onPress={() => setMode('login')}>
                <Text style={styles.toggleText}>
                  <Text style={styles.toggleLink}>Terug naar inloggen</Text>
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  backButton: {
    padding: 4,
  },
  backButtonGlass: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    // No extra background/border - BlurView provides the glass effect
  },
  sfSymbol: {
    width: 20,
    height: 20,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  brandTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: '#0a0a0a',
    fontFamily: 'Georgia',
    marginBottom: 8,
  },
  brandSubtitle: {
    fontSize: 17,
    color: '#71717a',
    fontFamily: 'System',
  },
  formContainer: {
    gap: 16,
  },
  inputWrapper: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  inputGlass: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 14,
    overflow: 'hidden',
  },
  inputIcon: {
    width: 24,
    marginRight: 12,
  },
  inputSfSymbol: {
    width: 20,
    height: 20,
  },
  input: {
    flex: 1,
    fontSize: 17,
    color: '#0a0a0a',
    fontFamily: 'System',
  },
  eyeButton: {
    padding: 4,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: -8,
  },
  forgotText: {
    fontSize: 14,
    color: '#E36B2C',
    fontFamily: 'System',
  },
  submitButtonContainer: {
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 8,
  },
  submitButton: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(10, 10, 10, 0.85)',
    borderRadius: 14,
    overflow: 'hidden',
  },
  submitText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: 'System',
  },
  toggleContainer: {
    alignItems: 'center',
    marginTop: 32,
  },
  toggleText: {
    fontSize: 15,
    color: '#71717a',
    fontFamily: 'System',
  },
  toggleLink: {
    color: '#E36B2C',
    fontWeight: '600',
  },
});
