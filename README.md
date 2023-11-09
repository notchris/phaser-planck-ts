# Phaser3 + Planck (Typescript)

A repo for testing an updated version of [phaser3-planck](https://github.com/notchris/phaser3-planck) written in TS.

## Install / Run
In the project directory
```bash
yarn
yarn dev

```

## Notes
So far I've created the basic shapes demo from the original repo. I had to augment some of phasers interfaces to allow access to `scene.planck`, etc. There may be a better way to do this? Check out the phaser-extensions declaration file.

I've commented out the debug draw temporarily because I feel like it should really be based on the planck body properties and converted to pixels rather than simply using the sprites information. 



## Contributing

Pull requests are welcome.

## License

[MIT](https://choosealicense.com/licenses/mit/)