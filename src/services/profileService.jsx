// src/services/profileService.jsx

import FetchHelper from "../fetchHelper";

export async function getProfile(authorId) {
  let result = null;

  // Load different data on /profile and /author
  if (window.location.pathname === "/profile") {
    result = await FetchHelper.profile.get({ id: localStorage.getItem("authorId") })
  } else {
    result = await FetchHelper.profile.get({ id: authorId })
  }

  console.log(result)
  if (result.ok) {
    return result.response;
  }
}

export async function updateProfile(patch) {
  console.log(patch)

  if (patch.imgUrl) {

    const resultImg = await FetchHelper.profile.uploadImg(
      {
        userId: localStorage.getItem("userId"),
        file: patch.imgUrl
      }
    )

    console.log("IMG RESP")
    console.log(resultImg)
  }

  const result = await FetchHelper.profile.edit(
    {
      id: localStorage.getItem("authorId"),
      bio: patch.bio
    }
  )
  if (result && result.ok) {
    return patch
  }
}