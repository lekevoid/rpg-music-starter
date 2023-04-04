<template>
	<q-page class="row items-center justify-evenly">
		<q-card class="my-card text-white" style="width: 100%; max-width: 500px">
			<q-card-section>
				<div class="col-12">
					<q-input v-model="email" outlined label="Email">
						<template v-slot:prepend>
							<q-icon name="place" />
						</template>
					</q-input>
				</div>
				<div class="col-12">
					<q-input v-model="password" outlined :type="hidePassword ? 'password' : 'text'" label="Password">
						<template v-slot:prepend>
							<q-icon name="place" />
						</template>
						<template v-slot:append>
							<q-icon :name="hidePassword ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="hidePassword = !hidePassword" />
						</template>
					</q-input>
				</div>
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

const email = ref("Hello");
const password = ref("");
const hidePassword = ref(true);

const handleLogin = async () => {
	try {
		await login();
	} catch (error) {
		alert(error.message);
	}
};
</script>
