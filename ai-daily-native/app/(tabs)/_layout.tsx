import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs
      backgroundColor="transparent"
      blurEffect="systemMaterial"
      tintColor="#E36B2C"
      iconColor="#0a0a0a"
      labelStyle={{ fontSize: 11, fontWeight: '400' }}
    >
      <NativeTabs.Trigger name="index">
        <Icon sf={{ default: 'house', selected: 'house.fill' }} selectedColor="#E36B2C" />
        <Label>Voorpagina</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="net-binnen">
        <Icon sf={{ default: 'clock', selected: 'clock.fill' }} selectedColor="#E36B2C" />
        <Label>Net binnen</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="mijn-nieuws">
        <Icon sf={{ default: 'heart', selected: 'heart.fill' }} selectedColor="#E36B2C" />
        <Label>Mijn nieuws</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="meer">
        <Icon sf={{ default: 'ellipsis.circle', selected: 'ellipsis.circle.fill' }} selectedColor="#E36B2C" />
        <Label>Meer</Label>
      </NativeTabs.Trigger>

      {/* Hidden routes that still share the tab bar */}
      <NativeTabs.Trigger name="profile" hidden />
      <NativeTabs.Trigger name="opgeslagen" hidden />
      <NativeTabs.Trigger name="preferences" hidden />
    </NativeTabs>
  );
}
