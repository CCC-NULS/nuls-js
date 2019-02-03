import { Block } from '../block';

describe('Block integration tests', () => {

  describe('::getHash()', () => {

    it('should produce a valid block hash when there are internal contract transactions', () => {

      const internalTxBlockBytes: Buffer = Buffer.from('ACDy/7FhtqYtn8SzAQ0Tdqe0VMTxk9rPtUPBDCwLM/FE1gAg+bPdFaz6ullAk6RirCSZrq3yj4wRaE4vFEoL1Gp/d/IwFOnsZgGkBgEABAAAAD07SgwADQDwd+jsZgEEAAIAAAACAAAAWgAQJwAAIDclIydgZFygHWzkrbLWgLSvCvDgmO33AurQ7QDNnhw0IQOwkUZtIHN9sSO5INovNsUXkejuSJSpibf+ihnfLsARKABGMEQCIGdIPv6xetT0ORWs/RAtMH/JGsE5SHPDiVqqHnGfQJxcAiA8zMcZvg8CzBjKg9tghCdeGjTI2IDRM2rfwFjZa2PvXQEAMBTp7GYBAP////8AAhcFAQHMBf96ARUkuxZegKVgCJZgIHR2KDjJOgAAAAAAjAoBAAAAFwUBAcpUf/UAwmdMMbWFuT1ZQxOJSo3LgMEYAAAAAACMCgEAAAAAZQA28ejsZgESYXNmc2FmZHNmZ2RzZ2RmZ2J2BQEBylR/9QDCZ0wxtYW5PVlDE4lKjcsFAQKuMmjs4q70rPhSZQLIOxUaNbOsXADIF6gEAAAAODgDAAAAAAAZAAAAAAAAAAhfcGF5YWJsZQ4oKSByZXR1cm4gdm9pZAACIwAgMCT5ZmnutfgkRnT5idU7wl93nOdXaHtQr69tv9/fKUIADKc9SAAAAAAAAAAAAAAjACDZs5BlPglv43IqwX8Djs4hvFWI5gOodb19yCqO0wHoyAAAyBeoBAAAAAAAAAAAAAIXBQECrjJo7OKu9Kz4UmUCyDsVGjWzrFwAyBeoBAAAAAAAAAAAABcFAQHKVH/1AMJnTDG1hbk9WUMTiUqNy/Si60cAAAAAAAAAAAAAayEDYAnk04uzOnvbIoAEEao0Ly2AxaXU5iQRWr6/FZkpQUAARzBFAiEAilTRNhKvqXFbklh4vGpGbqyTRV/sOti5Ku/hdBmEe90CIDJYYZgPJVRJmLLo+rW7VVjwxwuOJBFhlcRV/P3en+lnZwAwFOnsZgEAACASTuyypONPVdrFbmHrRY0XmoPd9cPb654dYG0vSliaTgUBAq4yaOzirvSs+FJlAsg7FRo1s6xcAQEjACASTuyypONPVdrFbmHrRY0XmoPd9cPb654dYG0vSliaTgAAyBeoBAAAAAAAAAAAAAEXBQEBDYs252+VntBd0VbfjJ0+HwYuHIEAyBeoBAAAAAAAAAAAAAACAOYN6exmAQljb2luLXRlc3T/////ASMAIF1HZAuf6JcbKJlQRJ+2C2IzzAaIl2qs1ztrNZTxsWSkARTYw0nYoAEAAAAAAAAAAhcFAQFmsTJ4yR/TpC9NKegCA3x4ouQ61QBpSHB0AAAAAAAAAAAAFwUBAVKLQoznHcZ3HODigr5+ih6HKPB1dOh52WOgAQAAAAAAAABqIQI756H58nX7ecrdvo902IcUlZ27bbW7OIZP16giDaroPABGMEQCICLwar8rD27HgBajY2zEY2DnwGNTSjRT6JIHGkcVIyp7AiBzmXCSOjlwMGw6rReQvxTy7/bCA9PNlN5sdw87fK2TDQ==', 'base64');
      const internalTxBlockHash: string = '0020ecbadeb9a8a134be06c2067ac6bcefbc57edfd616e163acd05e30c180258f990';

      const block: Block = Block.fromBytes(internalTxBlockBytes);
      expect(block.getHash()).toEqual(internalTxBlockHash);

    });

    it('should produce a valid block hash there are not internal contract transactions', () => {

      const oldTxBytes: Buffer = Buffer.from('ACCVtyL5tbIBJD3KMaeULlBELo8aDMVl5cbLS8GdLE8o8wAgt6RxSEcTPDL/sV446QytAOaylxD3H5ATbtlQuJoZaGAg7ejsZgGjBgEAAQAAAD07SgwADQDwd+jsZgEDAAIAAAACAAAAWgAQJwAAIDl5nQU1bDlC800WeMS8DgSiAUJs3d40nQQZy3NDuS4gIQOmzfqeD9WVAn7XY36qrisuFlnoJ6DSFwzTZaC72EQXhQBHMEUCIQCzvG+8FeeOkObK8e0BFDaI0qrs6BD12bM5GjyEkDvM/QIgY/ZNu7WdU7KuNrpydwgOK+4JDiaV0FaEUHZsS66q7csBACDt6OxmAQD/////AAMXBQEBj+RFsJovbn13e4BIjrTTJQRV5e6/JEAFAAAAAIsKAQAAABcFAQH0qS/uv9Nvposd4xqeix6piJ1WR9iU7QUAAAAAiwoBAAAAFwUBAfjtsLAUdIoaiDClVbJSvcM40xLkrBC+BAAAAACLCgEAAAAA', 'base64');
      const oldTxHash: string = '0020f2ffb161b6a62d9fc4b3010d1376a7b454c4f193dacfb543c10c2c0b33f144d6';

      const block: Block = Block.fromBytes(oldTxBytes);
      expect(block.getHash()).toEqual(oldTxHash);

    });

    it('should produce a valid block hash when the extend is bigger than expected', () => {

      const internalTxBlockBytes: Buffer = Buffer.from('ACBdoM68DCanqiekv/usWBR/qK0VRle7l/PD/ZSkLmkoBAAgeZqsTOnCTGNihfTgX5LL4dJP+Tc4V6+8EBZNRQpB9uKAuC1jZwEU1QMAAQAAAEKDkwwADQBgai1jZwECAAIAAAACAAAAWgAQJwAAIKxV+gB6BFztw/n2GPV21jgd3b81bEfmcKsaknepbznkAAEAAQEhAhFwmqeMZ6UuNUDHcGQdBL7CjjP3+lNuvACIdTAkpkMcAEcwRQIhALfd148fMr+Eogd1m/4ZUhN9LLW5Mb38WWQBNXOe+CW3AiAfsAoj9i3vUA+gXyitPgJ5h0z79TX5xabB6fpyr7G9ogEAgLgtY2cBAP////8AARcFAQHAr1pAN1JIIEpRoqhJz9+ujpevNdJIhA0AAAAA/NgDAAAAAA==', 'base64');
      const internalTxBlockHash: string = '00208c2506c7824e2244519438917b8df322c445e54c00039fa8ce0e4b101016d732';

      const block: Block = Block.fromBytes(internalTxBlockBytes);
      expect(block.getHash()).toEqual(internalTxBlockHash);

    });

  });

});