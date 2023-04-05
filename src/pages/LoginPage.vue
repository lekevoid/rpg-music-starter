<template>
	<q-page class="row items-center justify-evenly">
		<q-card class="my-card text-white" style="width: 100%; max-width: 500px">
			<q-card-section>
				<q-input v-model="email" outlined label="Email" class="q-mb-md">
					<template v-slot:prepend>
						<q-icon name="place" />
					</template>
				</q-input>
				<q-input v-model="password" outlined :type="hidePassword ? 'password' : 'text'" label="Password" class="q-mb-md">
					<template v-slot:prepend>
						<q-icon name="place" />
					</template>
					<template v-slot:append>
						<q-icon :name="hidePassword ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="hidePassword = !hidePassword" />
					</template>
				</q-input>
				<q-btn color="primary" glossy label="Login" @click="handleLogin" />
			</q-card-section>

			<q-card-section class="q-pt-none">
				<pre>email: {{ email }}</pre>
				<pre>pass: {{ password }}</pre>
				<pre>isLoggedIn: {{ isLoggedIn }}</pre>
			</q-card-section>
		</q-card>
	</q-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import useAuthUser from "src/composables/UseAuthUser";

const { login, isLoggedIn } = useAuthUser();

const email = ref("gagnon.kev@gmail.com");
const password = ref("change");
const hidePassword = ref(true);

const handleLogin = async () => {
	try {
		await login(email.value, password.value);
	} catch (error) {
		alert(error.message);
	}
};
</script>
