import shutil
import os
import getpass

# 現在のユーザー名を取得
username = getpass.getuser()
addon_name = "Paxels"

# パスをユーザー名に応じて設定
path_old = f"./{addon_name}_BP"
path_new = f"C:/Users/{username}/AppData/Local/Packages/Microsoft.MinecraftUWP_8wekyb3d8bbwe/LocalState/games/com.mojang/development_behavior_packs/{addon_name}_BP"

if os.path.exists(path_new):
    shutil.rmtree(path_new)
shutil.copytree(path_old, path_new)

path_old = f"./{addon_name}_RP"
path_new = f"C:/Users/{username}/AppData/Local/Packages/Microsoft.MinecraftUWP_8wekyb3d8bbwe/LocalState/games/com.mojang/development_resource_packs/{addon_name}_RP"

if os.path.exists(path_new):
    shutil.rmtree(path_new)
shutil.copytree(path_old, path_new)
