import requests
import os

urls = [
    'https://unpkg.com/jszip@3.7.1/dist/jszip.js',
    'https://unpkg.com/file-saver@2.0.0-rc.2/dist/FileSaver.js',
    'https://raw.githubusercontent.com/holy-the-sea/CP2AT/main/src/coords_info/craftable_coords.json',
    'https://raw.githubusercontent.com/holy-the-sea/CP2AT/main/src/coords_info/springobjects_coords.json',
    'https://raw.githubusercontent.com/holy-the-sea/CP2AT/main/src/coords_info/furniture_coords.json',
]

#make renderer/libs folder if it doesn't exist
if not os.path.exists('renderer/libs'):
    os.makedirs('renderer/libs')

def get_libs():
    #download libs
    for url in urls:
        r = requests.get(url)
        cwd = os.getcwd()
        outpath = f'{cwd}\\renderer\\libs\\{url.split("/")[-1]}'

        print(f'Writing {outpath}')

        with open(outpath, 'w', encoding='utf-8') as f:
            f.write(r.text)

if __name__ == '__main__':
    get_libs()