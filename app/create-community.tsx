import InputComponent from '@/components/Form/Input'
import TextAreaComponent from '@/components/Form/TextArea'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { SafeAreaView } from 'react-native'
import {
  Avatar,
  Button,
  Form,
  Image,
  Label,
  ScrollView,
  Separator,
  Switch,
  View,
  VisuallyHidden,
  XStack,
  YStack,
} from 'tamagui'
import { z } from 'zod'
import * as ImagePicker from 'expo-image-picker'
import { client } from '@/lib/axios'
import useAuthStore from '@/state/authStore'
import { router } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const CreateCommunityFormSchema = z.object({
  name: z.string({ message: 'required' }).min(3, 'Name must be at least 3 characters'),
  description: z
    .string({ message: 'required' })
    .min(3, 'Description must be at least 3 characters'),
  avatar: z.string().optional(),
  cover: z.string().optional(),
  isPrivate: z.boolean({ message: 'required' }),
})

export default function CreateCommunity() {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm<typeof CreateCommunityFormSchema._type>({
    resolver: zodResolver(CreateCommunityFormSchema),
    reValidateMode: 'onBlur',
    defaultValues: {
      description: '',
      name: '',
      isPrivate: false,
    },
  })
  const token = useAuthStore((state) => state.token)
  const watchCover = watch('cover')
  const watchAvatar = watch('avatar')
  const insets = useSafeAreaInsets()

  const onSubmit = async (data: typeof CreateCommunityFormSchema._type) => {
    try {
      const res = await client.post('/community', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const d = res.data.data
      router.push(`/community/${d.id}`)
    } catch (e) {
      console.error(e)
    }
  }

  const pickImage = async (field: 'avatar' | 'cover') => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: field === 'cover' ? [16, 9] : [1, 1],
      quality: 0.3,
      base64: true,
      allowsMultipleSelection: false,
    })

    if (!result.canceled) {
      setValue(field, result.assets[0].uri)
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <YStack jc="space-between" h="100%">
        <SafeAreaView style={{ flexGrow: 1 }}>
          <ScrollView
            keyboardDismissMode="on-drag"
            p="$2"
            contentContainerStyle={{
              display: 'flex',
              gap: 12,
            }}
          >
            <Image
              source={{
                uri:
                  watchCover ||
                  'https://coltonconcrete.co.uk/wp-content/uploads/2021/10/placeholder1.jpg',
                height: 140,
              }}
              borderRadius="$2"
            />
            <Avatar
              size="$8"
              mt="$-10"
              borderRadius="$2"
              borderColor="white"
              borderWidth="$1"
              backgroundColor="$blue10"
            >
              <Avatar.Image
                source={{
                  uri:
                    watchAvatar ||
                    'https://coltonconcrete.co.uk/wp-content/uploads/2021/10/placeholder1.jpg',
                  height: 140,
                }}
              />
              <Avatar.Fallback />
            </Avatar>
            <Controller
              name="cover"
              control={control}
              render={({ field: { onChange, value, onBlur }, fieldState: { error } }) => (
                <VisuallyHidden>
                  <InputComponent
                    id="cover"
                    label="Cover"
                    inputProps={{
                      value,
                      onBlur,
                      onChangeText: onChange,
                      // add red border if error
                      borderColor: error ? 'red' : undefined,
                    }}
                    message={error?.message}
                    messageProps={{
                      color: 'red',
                    }}
                  />
                </VisuallyHidden>
              )}
            />
            <Controller
              name="avatar"
              control={control}
              render={({ field: { onChange, value, onBlur }, fieldState: { error } }) => (
                <VisuallyHidden>
                  <InputComponent
                    id="avatar"
                    label="Avatar"
                    inputProps={{
                      value,
                      onBlur,
                      onChangeText: onChange,
                      // add red border if error
                      borderColor: error ? 'red' : undefined,
                    }}
                    message={error?.message}
                    messageProps={{
                      color: 'red',
                    }}
                  />
                </VisuallyHidden>
              )}
            />
            <XStack gap="$2" p="$2" backgroundColor="$gray2" borderRadius="$4">
              <Button size="$3" onPress={() => pickImage('avatar')}>
                Change Avatar
              </Button>
              <Button size="$3" onPress={() => pickImage('cover')}>
                Change Cover Photo
              </Button>
            </XStack>
            <YStack gap="$2" p="$2" backgroundColor="$gray2" borderRadius="$4">
              <Controller
                name="name"
                control={control}
                render={({
                  field: { onChange, value, onBlur },
                  fieldState: { error },
                }) => (
                  <InputComponent
                    id="name"
                    label="Name"
                    variant="inline"
                    required
                    inputProps={{
                      placeholder: 'Riding Community',
                      value,
                      onBlur,
                      onChangeText: onChange,
                      // add red border if error
                      borderColor: error ? 'red' : undefined,
                    }}
                    message={error?.message}
                    messageProps={{
                      color: 'red',
                    }}
                  />
                )}
              />
              <Separator />
              <Controller
                name="description"
                control={control}
                render={({
                  field: { onChange, value, onBlur },
                  fieldState: { error },
                }) => (
                  <TextAreaComponent
                    id="description"
                    label="Description"
                    variant="inline"
                    required
                    textAreaProps={{
                      placeholder: 'Description',
                      maxHeight: 200,
                      value,
                      onBlur,
                      onChangeText: onChange,
                      // add red border if error
                      borderColor: error ? 'red' : undefined,
                    }}
                    message={error?.message}
                    messageProps={{
                      color: 'red',
                    }}
                  />
                )}
              />
            </YStack>
            <YStack gap="$2" p="$2" backgroundColor="$gray2" borderRadius="$4">
              <Controller
                name="isPrivate"
                control={control}
                render={({
                  field: { onChange, value, onBlur },
                  fieldState: { error },
                }) => (
                  <XStack alignItems="center" jc="space-between" gap="$4">
                    <Label
                      color="$color05"
                      unstyled
                      fontSize="$4"
                      onPress={() => onChange(!value)}
                    >
                      Make Community Private
                    </Label>
                    <Switch checked={value} onCheckedChange={onChange} onBlur={onBlur}>
                      <Switch.Thumb animation="quicker" />
                    </Switch>
                  </XStack>
                )}
              />
            </YStack>
          </ScrollView>
        </SafeAreaView>
        <View bg="$color5" p="$4">
          <Form.Trigger asChild>
            <Button backgroundColor="$blue8" mb={insets.bottom}>
              Save Changes
            </Button>
          </Form.Trigger>
        </View>
      </YStack>
    </Form>
  )
}
